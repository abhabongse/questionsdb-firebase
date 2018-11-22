/** Checks if the running browser is in a mobile device. */
function mobileTest() {
  return process.browser
    && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      .test(navigator.userAgent);
}

/** Checks if the running browser is in an iOS device. */
function iOSTest() {
  return process.browser
    && /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/** Download text file from a given string. */
function downloadTextFile(filename, text, specifiedMimeType) {
  const element = document.createElement("a");
  const mimeType = specifiedMimeType || "text/plain";

  element.setAttribute(
    "href", `data:${mimeType};charset=utf-8,` + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/** Upload text file from browser. */
function uploadTextFile(successCallback, errorCallback) {
  const element = document.createElement("input");

  element.setAttribute("type", "file");
  element.style.display = "none";
  document.body.appendChild(element);

  // Callback once user has already selected a file
  element.onchange = () => {
    const files = element.files;
    if (files.length <= 0) {
      document.body.removeChild(element);
      return;
    }

    // Create file reader with event handlers
    const reader = new FileReader();
    reader.onload = event => {
      successCallback(event.target.result);
    };
    reader.onabort = event => { errorCallback(event); };
    reader.onerror = event => { errorCallback(event); };

    // Trigger reader
    reader.readAsText(files.item(0));
    document.body.removeChild(element);
  };
  element.click();
}

export { mobileTest, iOSTest, downloadTextFile, uploadTextFile };
