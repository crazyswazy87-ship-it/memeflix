import { useCallback, useEffect, useState } from "react";
import { useDropzone, type FileWithPath } from "react-dropzone";
import kibz from '../../../public/assetss/images/default-memee.png'
import PhotoChange from "./PhotoChange";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl?: string;
};

const DEFAULT_IMAGE_URL = kibz;

// Convert URL → File
const urlToFile = async (url: string, filename: string) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

const FileUpload = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>("");


  useEffect(() => {
    const initFile = async () => {
      if (file.length > 0) return;

      const sourceUrl = mediaUrl || DEFAULT_IMAGE_URL;

      try {
        const defaultFile = await urlToFile(sourceUrl, "default-meme.png");

        setFile([defaultFile]);
        fieldChange([defaultFile]);
        setFileUrl(sourceUrl);
      } catch (err) {
        console.error("Failed to load default file", err);
      }
    };

    initFile();
  }, [mediaUrl, file.length, fieldChange]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      if (!acceptedFiles.length) return;

      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [fieldChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".png", ".gif", ".webp", ".jpeg", ".heic", ".heif"],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />

      {fileUrl ? (
        <div className="inpud">
          <span className="explainer2">
            <PhotoChange />
          </span>
          <img src={fileUrl} alt="preview" />
        </div>
      ) : (
        <div className="fileuploader-b1x">
          <img
            src="/assetss/icons/add-post-icon.png"
            alt="upload"
            className="unused-screenshot"
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;