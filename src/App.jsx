import { useRef, useState } from "react";
import Preview from "./components/Preview";
import FrameOverlay from "./components/FrameOverlay";
import ElementOverlay from "./components/ElementOverlay";
import "./App.css";

function App() {
  const [overlayItems, setOverlayItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [photoURL, setPhotoURL] = useState(null);
  const [mode, setMode] = useState("camera");

  const previewRef = useRef(null);

  // ---------------------------------------------------
  // ADD FRAME (fullscreen)
  // ---------------------------------------------------
  const addFrame = (url) => {
    const id = Date.now();

    const preview = document.querySelector(".preview-container");
    const w = preview.clientWidth;
    const h = preview.clientHeight;

    const newItem = {
      id,
      type: "frame",
      src: url,
      x: 0,
      y: 0,
      width: w,
      height: h,
    };

    setOverlayItems((items) => [...items, newItem]);
    setSelectedId(id);
  };

  // ---------------------------------------------------
  // ADD ELEMENT (smaller)
  // ---------------------------------------------------
  const addElement = (url) => {
    const id = Date.now();

    const newItem = {
      id,
      type: "element",
      src: url,
      x: 120,
      y: 120,
      width: 200,
      height: 200,
    };

    setOverlayItems((items) => [...items, newItem]);
    setSelectedId(id);
  };

  // ---------------------------------------------------
  // BUILT-IN FRAME SELECT
  // ---------------------------------------------------
  const handleBuiltInFrame = (e) => {
    if (!e.target.value) return;
    addFrame(e.target.value);
  };

  // ---------------------------------------------------
  // CUSTOM FRAME UPLOAD
  // ---------------------------------------------------
  const handleUploadFrame = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => addFrame(ev.target.result);
    reader.readAsDataURL(file);

    document.querySelector("#builtinFrameSelect").value = "";
  };

  // ---------------------------------------------------
  // ADD ELEMENT
  // ---------------------------------------------------
  const handleAddElement = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => addElement(ev.target.result);
    reader.readAsDataURL(file);
  };

  // ---------------------------------------------------
  // PHOTO UPLOAD
  // ---------------------------------------------------
  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoURL(ev.target.result);
      setMode("photo");
    };
    reader.readAsDataURL(file);
  };

  // ---------------------------------------------------
  // DELETE SELECTED
  // ---------------------------------------------------
  const deleteSelected = () => {
    if (selectedId === null) return;
    setOverlayItems((items) => items.filter((i) => i.id !== selectedId));
    setSelectedId(null);
  };

  // ---------------------------------------------------
  // CAPTURE SCREEN
  // ---------------------------------------------------
  const captureImage = async () => {
    const preview = document.querySelector(".preview-container");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const width = preview.clientWidth;
    const height = preview.clientHeight;

    canvas.width = width;
    canvas.height = height;

    if (mode === "camera") {
      const video = preview.querySelector("video");
      ctx.drawImage(video, 0, 0, width, height);
    }
    if (mode === "photo") {
      const img = preview.querySelector("img");
      ctx.drawImage(img, 0, 0, width, height);
    }

    for (const item of overlayItems) {
      const imgElement = new Image();
      imgElement.src = item.src;
      await new Promise((res) => (imgElement.onload = res));

      ctx.drawImage(imgElement, item.x, item.y, item.width, item.height);
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `photo-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="app">
      <header>
        <h1>Photo Booth</h1>
      </header>

      <div className="controls">
        <label>
          Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="camera">Camera</option>
            <option value="photo">Photo</option>
          </select>
        </label>

        <label>
          Choose Photo:
          <input type="file" accept="image/*" onChange={handleUploadPhoto} />
        </label>

        <label>
          Frame:
          <select id="builtinFrameSelect" onChange={handleBuiltInFrame}>
            <option value="">None</option>
            <option value="/frames/1.png">Frame 1</option>
            <option value="/frames/2.png">Frame 2</option>
            <option value="/frames/3.png">Frame 3</option>
            <option value="/frames/4.png">Frame 4</option>
            <option value="/frames/5.png">Frame 5</option>
          </select>
        </label>

        <label>
          Custom Frame:
          <input type="file" accept="image/*" onChange={handleUploadFrame} />
        </label>

        <label>
          Add Element:
          <input type="file" accept="image/*" onChange={handleAddElement} />
        </label>

        <button onClick={deleteSelected}>Delete Selected</button>
        <button onClick={captureImage}>Capture Photo</button>
      </div>

      <div className="preview-wrapper">
        <div className="preview-container" ref={previewRef}>
          <Preview mode={mode} photoURL={photoURL} />

          {/* Render both types properly */}
          {overlayItems.map((item) =>
            item.type === "frame" ? (
              <FrameOverlay
                key={item.id}
                item={item}
                isSelected={selectedId === item.id}
                onSelect={() => setSelectedId(item.id)}
                onDelete={() => deleteSelected()}
                onChange={(updated) =>
                  setOverlayItems((items) =>
                    items.map((i) => (i.id === item.id ? updated : i))
                  )
                }
              />
            ) : (
              <ElementOverlay
                key={item.id}
                item={item}
                isSelected={selectedId === item.id}
                onSelect={() => setSelectedId(item.id)}
                onDelete={() => deleteSelected()}
                onChange={(updated) =>
                  setOverlayItems((items) =>
                    items.map((i) => (i.id === item.id ? updated : i))
                  )
                }
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
