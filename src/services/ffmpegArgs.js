import dotenv from "dotenv";
dotenv.config();
const {
  DEFAULT_FPS=30, DEFAULT_WIDTH=1280, DEFAULT_HEIGHT=720,
  DEFAULT_VIDEO_BITRATE="3000k", DEFAULT_AUDIO_BITRATE="128k",
  DEFAULT_KEYINT=60
}=process.env;

export function buildFfmpegArgs({ input, loop=false, options={}, outputs=[] }){
  const fps=options.fps||Number(DEFAULT_FPS);
  const width=options.width||Number(DEFAULT_WIDTH);
  const height=options.height||Number(DEFAULT_HEIGHT);
  const vBitrate=options.videoBitrate||DEFAULT_VIDEO_BITRATE;
  const aBitrate=options.audioBitrate||DEFAULT_AUDIO_BITRATE;
  const keyint=options.keyint||Number(DEFAULT_KEYINT);
  if(!outputs.length) throw new Error("No RTMP output");

  const isHls=/\.m3u8(\?.*)?$/i.test(input);
  const args=[
    ...(!isHls?["-re"]:[]),
    ...(loop?["-stream_loop","-1"]:[]),
    "-i", input,
    "-analyzeduration","0","-probesize","32M",
    "-vf",`scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
    "-c:v","libx264","-preset","veryfast","-profile:v","high","-pix_fmt","yuv420p",
    "-r",String(fps),"-g",String(keyint),"-keyint_min",String(keyint),
    "-b:v",vBitrate,"-maxrate",vBitrate,"-bufsize","2M",
    "-c:a","aac","-ar","44100","-b:a",aBitrate,"-ac","2","-tune","zerolatency",
    "-f","flv", outputs[0]
  ];
  return args;
}
