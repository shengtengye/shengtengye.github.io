let isSupported = false;

if ('wakeLock' in navigator) {
  isSupported = true;
  console.log('Screen Wake Lock API supported!');
} else {
  console.log('Wake lock is not supported by this browser.');
}

if (isSupported) {
  // create a reference for the wake lock
  let wakeLock = null;

  // create an async function to request a wake lock
  const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock is active!');
    } catch (err) {
      // if wake lock request fails - usually system related, such as battery
      console.log(`${err.name}, ${err.message}`);
    }
  }
  
  requestWakeLock()
}
