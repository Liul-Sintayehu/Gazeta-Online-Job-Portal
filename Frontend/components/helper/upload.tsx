import { useState, ChangeEvent } from 'react';

interface Props {
  
  DownloadTemplate: () => void;
  handleUpload: (file: File | null) => void;
}

const Upload: React.FC<Props> = ({  DownloadTemplate, handleUpload }) => {
  const [showFileInput, setShowFileInput] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    setShowFileInput(true);
  };

  return (
    <div className="flex justify-between items-center">
      <div></div>
      <div>
         
        <div className='inline ml-3 space-x-2 text-blue-500'>
          <button onClick={DownloadTemplate}>Download</button>

          {/* Conditional rendering for file input */}
          {!showFileInput ? (
            <button className="ml-3" onClick={handleUploadClick}>
              Upload
            </button>
          ) : (
            <div className='inline ml-3'>
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileChange} 
                className="inline-block"
              />
              <button 
                onClick={() => handleUpload(file)} 
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
