export const PAASTA_MODELS = [
 ['thinkingmachines/inkling-small:free','Inkling Small'],
 ['thinkingmachines/inkling:free','Inkling'],
 ['paasta/seed-2.1-turbo:free','Seed 2.1 Turbo'],
 ['paasta/seed-2.1-pro:free','Seed 2.1 Pro'],
 ['paasta/qwen3.8-27b:free','Qwen3.8 27B (Paasta)'],
 ['paasta/qwen3.8-max:free','Qwen3.8 Max (Paasta)'],
 ['paasta/qwen3.7-max:free','Qwen3.7 Max'],
 ['qwen/qwen3.8-27b:free','Qwen3.8 27B (Qwen)'],
 ['apinex/qwen-3.8-max:free','Qwen3.8 Max (Apinex)'],
 ['poolside/laguna-xs-2.1:free','Laguna XS 2.1'],
 ['poolside/laguna-s-2.1:free','Laguna S 2.1'],
 ['nvidia/nemotron-3.5-lightning:free','Nemotron 3.5 Lightning'],
 ['nvidia/nemotron-3.5-content-safety:free','Nemotron 3.5 Content Safety'],
 ['nvidia/nemotron-3-ultra-550b-a55b:free','Nemotron 3 Ultra'],
 ['nvidia/nemotron-3-super-120b-a12b:free','Nemotron 3 Super'],
 ['nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free','Nemotron 3 Nano Omni'],
 ['apinex/muse-spark-1.3:free','Muse Spark 1.3'],
 ['paasta/muse-spark-1.1:free','Muse Spark 1.1'],
 ['apinex/minimax-m3.1:free','MiniMax M3.1'],
 ['apinex/minimax-m3:free','MiniMax M3'],
].map(([id,name])=>({id,name}));

// Chat models that answered on a free Gemini key (Oct 2026); the first is the default.
export const GEMINI_MODELS = [
 ['gemini-3.6-flash','Gemini 3.6 Flash'],
 ['gemini-3.8-flash','Gemini 3.8 Flash'],
 ['gemini-3.5-flash-lite','Gemini 3.5 Flash-Lite'],
 ['gemini-3.1-flash-lite','Gemini 3.1 Flash-Lite'],
].map(([id,name])=>({id,name}));
