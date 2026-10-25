export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./lib/scheduler');
    console.log('--- Instrumentation: Scheduler Otomatis Dimulai Saat Server Aktif ---');
  }
}
