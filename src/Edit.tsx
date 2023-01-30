import { useEffect, useRef, useState } from "react";
import PopoverPicker from "./colorpicker";
import { cloneData, duotone, getPixels } from "./utils";

const imageMimeType = /image\/(png|jpg|jpeg)/i;

const presets = [
  ['#6AFF7F', '#00007E'],
  ['#F8BE3D', '#682218'],
  ['#01DBFE', '#7F01D3'],
  ['#FBF019', '#01AB6D'],
  ['#FBCD20', '#FF5D77'],
  ['#DC4379', '#11245E'],
  ['#FFFFFF', '#91CFF8'],
  ['#FFEFB3', '#290900'],
  ['#ACD49D', '#602457'],
  ['#F00E2E', '#0A0505'],
  ['#EF009E', '#5062D6'],
  ['#01AB6D', '#241A5F'],
]

function Edit() {
  const [file, setFile] = useState<any>(null);
  const [color1, setColor1] = useState('#6AFF7F');
  const [color2, setColor2] = useState('#00007E');
  const preview = useRef<HTMLCanvasElement>(null);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [pixelData, setPixelData] = useState<ImageData | null>(null);

  const changeHandler = (e: any) => {
    const fileData = e.target.files[0];
    if (!fileData) return;
    if (!fileData?.type.match(imageMimeType)) {
      alert("Image type is not valid");
      return;
    }
    setFile(fileData);
  }

  useEffect(() => {
    const fileReader = new FileReader();
    const canvas = preview.current;
    let isCancel = false;
    if (file && canvas) {
      fileReader.onload = (e) => {
        if (!e.target) return;
        const { result } = e.target;
        if (result && !isCancel) {
          const img = new Image();
          img.onload = () => {
            const ctx = canvas.getContext('2d')!;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const ratio = img.naturalWidth / img.naturalHeight;
            const width = ratio > 1 ? canvas.width : canvas.width * ratio;
            const height = ratio > 1 ? canvas.width / ratio : canvas.height;
            ctx.drawImage(img, 0, 0, width, height);
            const pixels = getPixels(canvas);
            setPixelData(pixels);
          }
          img.src = result as string;
        }
      }
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }

  }, [file]);

  useEffect(() => {
    if (!preview.current || !pixelData) return;
    const canvas = preview.current;
    const ctx = canvas.getContext('2d')!;
    const clonedData = cloneData(pixelData);
    const newPixelData = duotone(clonedData, color1, color2);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(newPixelData, 0, 0);
  }, [pixelData, color1, color2]);

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const download = () => {
    const fileReader = new FileReader();
    const downloadCanvas = document.createElement('canvas');
    fileReader.onload = (e) => {
      if (!e.target) return;
      const { result } = e.target;
      if (result) {
        const img = new Image();
        img.onload = () => {
          const {width, height} = img;
          downloadCanvas.width = width;
          downloadCanvas.height = height;
          const ctx = downloadCanvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);
          const pixels = getPixels(downloadCanvas);
          const duoTonePixels = duotone(pixels, color1, color2);
          ctx.clearRect(0, 0, downloadCanvas.width, downloadCanvas.height);
          ctx.putImageData(duoTonePixels, 0, 0);

          const link = document.createElement('a');
          link.download = 'duotone.png';
          link.href = downloadCanvas.toDataURL();
          link.click();
        }
        img.src = result as string;
      }
    }

    fileReader.readAsDataURL(file);
  }

  const canvasClassName = file ? 'canvasWrapper' : 'canvasWrapper empty';

  return (
    <div>
      <h1>Editing Duotone Image</h1>
      <form>
        <p>
          <input
            type="file"
            accept='.png, .jpg, .jpeg'
            onChange={changeHandler}
            ref={hiddenFileInput}
            style={{display: 'none'}}
          />
        </p>
      </form>
      <div className="edit-wrapper">
        <div className={canvasClassName} onClick={handleClick}>
          <canvas id="preview" width={700} height={700} style={{'width': '700px', 'height': '700px'}} ref={preview} />
        </div>
        <div className="color-wrapper">
          <h3>Colors</h3>
          <div className="colors">
            <PopoverPicker color={color1} onChange={setColor1} />
            <PopoverPicker color={color2} onChange={setColor2} />
          </div>
          <h3>Presets</h3>
          <div className="presets">
            {presets.map((preset, i) => {
              const click = () => {
                setColor1(preset[0]);
                setColor2(preset[1]);
              }
              return (
                <div className="swatch-box" key={i} onClick={click}>
                  <div
                    className="swatch"
                    style={{ backgroundColor: preset[0] }}
                  />
                  <div
                    className="swatch"
                    style={{ backgroundColor: preset[1] }}
                  />
                </div>
              )
            })}
          </div>
          <div className="download" onClick={download} >Download</div>
        </div>
      </div>
    </div>
  );
}

export default Edit;
