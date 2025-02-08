// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { FileX2 } from 'lucide-react';

export default function PdfViewer({
  pdfFileUrl,
}: {
  pdfFileUrl: string | null;
}) {
  //   const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <>
      {pdfFileUrl ? (
        <div className="p-6 flex flex-col gap-4 justify-center items-center">
          <a
            href={pdfFileUrl}
            download
            target="_blank"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none"
          >
            Download PDF
          </a>
        </div>
      ) : (
        <div className="p-6 flex flex-col gap-4 justify-center items-center">
          <FileX2 className="h-10 w-10 text-gray-700" />
          <p className="text-center font-semibold text-gray-700">
            No document available
          </p>
        </div>
      )}
    </>
  );
}

{
  /* <>
            {pdfFileUrl ? (
                <div className='w-full bg-transparent'>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                        <Viewer fileUrl={pdfFileUrl} plugins={[defaultLayoutPluginInstance]} />
                    </Worker>
                </div>
            ) : (
                <div className="p-6 flex flex-col gap-4 justified-between items-center">
                    <FileX2 className="h-10 w-10 text-gray-700" />
                    <p className="text-center font-semibold text-gray-700">No document available</p>
                </div>
            )
            }
        </> */
}
