// Decode a video into numbered JPEG frames using macOS AVFoundation
// (handles HEVC/H.264 natively, no ffmpeg needed).
// Usage: swift scripts/extract-frames-mac.swift <clip> <outDir> <fps>
import AVFoundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count == 4, let fps = Double(args[3]) else {
  print("Usage: swift extract-frames-mac.swift <clip> <outDir> <fps>")
  exit(1)
}
let outDir = URL(fileURLWithPath: args[2], isDirectory: true)
try FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

let asset = AVURLAsset(url: URL(fileURLWithPath: args[1]))
let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero

let duration = CMTimeGetSeconds(asset.duration)
let count = Int(floor(duration * fps))

for i in 0..<count {
  let time = CMTime(seconds: Double(i) / fps, preferredTimescale: 600)
  let image = try generator.copyCGImage(at: time, actualTime: nil)
  let url = outDir.appendingPathComponent(String(format: "frame_%04d.jpg", i + 1))
  let dest = CGImageDestinationCreateWithURL(url as CFURL, UTType.jpeg.identifier as CFString, 1, nil)!
  CGImageDestinationAddImage(dest, image, [kCGImageDestinationLossyCompressionQuality: 0.95] as CFDictionary)
  CGImageDestinationFinalize(dest)
}
print(count)
