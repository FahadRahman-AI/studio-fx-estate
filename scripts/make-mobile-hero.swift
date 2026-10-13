// Export the mobile hero loop: a centre 9:16 crop of the hero clip,
// H.264, no audio, web-optimised. Uses macOS AVFoundation (no ffmpeg).
// Usage: swift scripts/make-mobile-hero.swift footage/hero.mp4 public/videos/hero-mobile.mp4
import AVFoundation

let args = CommandLine.arguments
guard args.count == 3 else {
  print("Usage: swift make-mobile-hero.swift <clip> <out.mp4>")
  exit(1)
}
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])
try? FileManager.default.removeItem(at: output)

let BITRATE = 3_000_000

let asset = AVURLAsset(url: input)
let track = asset.tracks(withMediaType: .video)[0]
let natural = track.naturalSize.applying(track.preferredTransform)
let srcW = abs(natural.width), srcH = abs(natural.height)

// Largest 9:16 window at full source height, centred horizontally (even width for H.264).
let outH = Int(srcH)
let outW = Int(srcH * 9 / 16) / 2 * 2
let offsetX = (srcW - CGFloat(outW)) / 2

let instruction = AVMutableVideoCompositionInstruction()
instruction.timeRange = CMTimeRange(start: .zero, duration: asset.duration)
let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: track)
layer.setTransform(track.preferredTransform.concatenating(CGAffineTransform(translationX: -offsetX, y: 0)), at: .zero)
instruction.layerInstructions = [layer]

let composition = AVMutableVideoComposition()
composition.renderSize = CGSize(width: outW, height: outH)
composition.frameDuration = track.minFrameDuration.isValid ? track.minFrameDuration : CMTime(value: 1, timescale: 30)
composition.instructions = [instruction]

let reader = try AVAssetReader(asset: asset)
let readerOutput = AVAssetReaderVideoCompositionOutput(
  videoTracks: [track],
  videoSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
readerOutput.videoComposition = composition
reader.add(readerOutput)

let writer = try AVAssetWriter(outputURL: output, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true
let writerInput = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: outW,
  AVVideoHeightKey: outH,
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: BITRATE,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
  ],
])
writer.add(writerInput)

reader.startReading()
writer.startWriting()
writer.startSession(atSourceTime: .zero)

let done = DispatchSemaphore(value: 0)
writerInput.requestMediaDataWhenReady(on: DispatchQueue(label: "encode")) {
  while writerInput.isReadyForMoreMediaData {
    if let sample = readerOutput.copyNextSampleBuffer() {
      writerInput.append(sample)
    } else {
      writerInput.markAsFinished()
      writer.finishWriting { done.signal() }
      return
    }
  }
}
done.wait()

if writer.status != .completed {
  print("Export failed: \(writer.error?.localizedDescription ?? "unknown")")
  exit(1)
}
print("Wrote \(outW)x\(outH) to \(output.path)")
