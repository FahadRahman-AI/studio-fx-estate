// Re-encode a clip for the web: H.264, fixed bitrate, no audio, moov atom at
// the front (fast start), scaled to a target width. Uses macOS AVFoundation.
// Usage: swift scripts/encode-web-video.swift <in> <out.mp4> [width=1920] [kbps=5000] [startSec] [endSec]
// startSec/endSec trim the web copy (e.g. to drop a fade from black); the source is untouched.
import AVFoundation

let args = CommandLine.arguments
guard args.count >= 3 else {
  print("Usage: swift encode-web-video.swift <in> <out.mp4> [width] [kbps] [startSec] [endSec]")
  exit(1)
}
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])
let targetW = args.count > 3 ? Int(args[3])! : 1920
let bitrate = (args.count > 4 ? Int(args[4])! : 5000) * 1000
let startSec = args.count > 5 ? Double(args[5])! : 0
let endSec: Double? = args.count > 6 ? Double(args[6])! : nil
try? FileManager.default.removeItem(at: output)

let asset = AVURLAsset(url: input)
let track = asset.tracks(withMediaType: .video)[0]
let natural = track.naturalSize.applying(track.preferredTransform)
let srcW = abs(natural.width), srcH = abs(natural.height)
let scale = min(1, CGFloat(targetW) / srcW)
let outW = Int(srcW * scale) / 2 * 2
let outH = Int(srcH * scale) / 2 * 2

let start = CMTime(seconds: startSec, preferredTimescale: 600)
let end = endSec.map { CMTime(seconds: $0, preferredTimescale: 600) } ?? asset.duration
let range = CMTimeRange(start: start, end: end)

let instruction = AVMutableVideoCompositionInstruction()
instruction.timeRange = CMTimeRange(start: .zero, duration: asset.duration)
let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: track)
layer.setTransform(track.preferredTransform.concatenating(CGAffineTransform(scaleX: scale, y: scale)), at: .zero)
instruction.layerInstructions = [layer]

let composition = AVMutableVideoComposition()
composition.renderSize = CGSize(width: outW, height: outH)
composition.frameDuration = track.minFrameDuration.isValid ? track.minFrameDuration : CMTime(value: 1, timescale: 30)
composition.instructions = [instruction]

let reader = try AVAssetReader(asset: asset)
reader.timeRange = range
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
    AVVideoAverageBitRateKey: bitrate,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
  ],
])
writer.add(writerInput)

reader.startReading()
writer.startWriting()
writer.startSession(atSourceTime: start)

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
