
using System;

public class ProfilerSample { // by SunboyL
	public static bool EnableProfilerSample = true;
	public static bool EnableFormatStringOutput = true;// 是否允许BeginSample的代码段名字使用格式化字符串（格式化字符串本身会带来内存开销）
	
	public static void BeginSample(string name) {
		#if ENABLE_PROFILER
		if (EnableProfilerSample){
			UnityEngine.Profiling.Profiler.BeginSample(name);
		}
		#endif
	}
	
	public static void BeginSample(string formatName, params object[] args) {
		#if ENABLE_PROFILER
		if (EnableProfilerSample) {
			// 必要时很有用，但string.Format本身会产生GC Alloc，需要慎用
			if (EnableFormatStringOutput)
				UnityEngine.Profiling.Profiler.BeginSample(string.Format(formatName, args));
			else
				UnityEngine.Profiling.Profiler.BeginSample(formatName);
		}
		#endif
	}
	
	public static void EndSample() {
		#if ENABLE_PROFILER
		if (EnableProfilerSample) {
			UnityEngine.Profiling.Profiler.EndSample();
		}
		#endif
	}
}