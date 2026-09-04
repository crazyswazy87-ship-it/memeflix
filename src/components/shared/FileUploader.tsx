import { useCallback, useEffect, useState } from "react";
import { useDropzone, type FileWithPath } from "react-dropzone";
import kibz from "../../../public/assetss/images/default-memee.png";


type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl?: string;
  fileInputRef?: React.RefObject<HTMLInputElement>;
};

const DEFAULT_IMAGE_URL = kibz;

// Convert URL → File
const urlToFile = async (url: string, filename: string) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

const FileUploader = ({
  fieldChange,
  mediaUrl,
  fileInputRef,
}: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>("");


  useEffect(() => {
  // show image, DON'T convert to file  my edit mode
  if (mediaUrl) {
    setFileUrl(mediaUrl);
    return;
  }

  // CREATE MODE → load default image
  const init = async () => {
    try {
      const f = await urlToFile(DEFAULT_IMAGE_URL, "default-meme.png");
      setFile([f]);
      fieldChange([f]);
      setFileUrl(DEFAULT_IMAGE_URL);
    } catch (err) {
      console.error("Default file load failed", err);
    }
  };

  init();
}, [mediaUrl]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      if (!acceptedFiles.length) return;

      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [fieldChange]
  );

  
  const handleUseDefault = async () => {
    try {
      const f = await urlToFile(DEFAULT_IMAGE_URL, "default-meme.png");
      setFile([f]);
      fieldChange([f]);
      setFileUrl(DEFAULT_IMAGE_URL);
    } catch (err) {
      console.error("Failed to apply default image", err);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".png", ".gif", ".webp", ".jpeg", ".heic", ".heif"],
    },
  });

  return (
    <div>
      {/*MAIN UPLOADER */}
      <div {...getRootProps()}>
        <input
          {...getInputProps()}
          ref={fileInputRef}
        />

        {fileUrl ? (
          <div className="input3">
            <img src={fileUrl} alt="preview" />
          </div>
        ) : (
          <div className="fileuploader-box">
            <img
              src="/assetss/icons/add-post-icon.png"
              alt="upload"
              className="unused-screenshot"
            />
            <p className="explainer">
              Click to add a photo / Drag & Drop
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default FileUploader;