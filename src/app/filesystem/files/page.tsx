"use client";
import Filebar from "@/components/component/Filebar";

const files = [
  {
    file_name: "report.pdf",
    file_size: "2.1 MB",
    file_type: "PDF",
    last_modified: "2025-10-20"
  },
  {
    file_name: "photo.jpg",
    file_size: "3.5 MB",
    file_type: "JPEG",
    last_modified: "2025-09-15"
  },
  {
    file_name: "presentation.pptx",
    file_size: "5.2 MB",
    file_type: "PPTX",
    last_modified: "2025-08-30"
  },
  {
    file_name: "data.xlsx",
    file_size: "1.8 MB",
    file_type: "Excel",
    last_modified: "2025-10-10"
  },
  {
    file_name: "notes.txt",
    file_size: "15 KB",
    file_type: "Text",
    last_modified: "2025-10-01"
  },
  {
    file_name: "video.mp4",
    file_size: "50 MB",
    file_type: "MP4",
    last_modified: "2025-09-25"
  },
  {
    file_name: "archive.zip",
    file_size: "10 MB",
    file_type: "ZIP",
    last_modified: "2025-07-20"
  },
  {
    file_name: "script.js",
    file_size: "25 KB",
    file_type: "JavaScript",
    last_modified: "2025-10-18"
  },
  {
    file_name: "style.css",
    file_size: "12 KB",
    file_type: "CSS",
    last_modified: "2025-10-19"
  },
  {
    file_name: "index.html",
    file_size: "8 KB",
    file_type: "HTML",
    last_modified: "2025-10-21"
  },
  {
    file_name: "diagram.svg",
    file_size: "500 KB",
    file_type: "SVG",
    last_modified: "2025-09-10"
  },
  {
    file_name: "audio.mp3",
    file_size: "7 MB",
    file_type: "MP3",
    last_modified: "2025-10-05"
  },
  {
    file_name: "ebook.epub",
    file_size: "1.2 MB",
    file_type: "EPUB",
    last_modified: "2025-08-01"
  },
  {
    file_name: "logo.png",
    file_size: "850 KB",
    file_type: "PNG",
    last_modified: "2025-09-30"
  },
  {
    file_name: "manual.docx",
    file_size: "2.8 MB",
    file_type: "DOCX",
    last_modified: "2025-10-12"
  }
];

const FilesPage = () => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center">
            <div className="max-w-5xl w-full mt-10 ">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white">My Files</h1>
                    <p className="text-shadow-zinc-500 mt-2">{files.length} files total</p>
                </div>
                <div className="flex flex-col gap-y-2   ">
                    {files.map((file,index)=>(  
                        <Filebar
                            key={index}
                            file_name={file.file_name}
                            file_size={file.file_size}
                            file_type={file.file_type}
                            last_modified={file.last_modified}
                            download={()=>alert(`Downloading ${file.file_name}`)}
                            delete={()=>alert(`Deleting ${file.file_name}`)}
                            rename={()=>alert(`Renaming ${file.file_name}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
export default FilesPage;