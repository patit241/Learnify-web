import { getCurrentCourseProgressService, markLectureAsViewedService, resetCourseProgressService } from "@/api/courseProgress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VideoPlayer from "@/components/VideoPlayer"
import studentContext from "@/context/student-context/studentContext"
import useAuthStore from "@/store/auth-store"
import { ArrowBigUp, ArrowBigUpDash, ArrowUpWideNarrow, Check, ChevronLeft, ChevronRight, Play } from "lucide-react"
import { useContext, useEffect, useRef, useState } from "react"
import ReactConfetti from "react-confetti"
import { useNavigate, useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input"



function StudentViewCourseProgressPage() {
  const user = useAuthStore(state => state.user)
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } = useContext(studentContext)
  const [lockCourse, setLockCourse] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const [currentLecture, setCurrentLecture] = useState(null)
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isSideBarOpen, setIsSideBarOpen] = useState(true)
  const [prompt, setPrompt] = useState("");
  const [resp, setResp] = useState("");
  const [loading, setLoading] = useState(false);
  const divRef = useRef(null);
  const token = useAuthStore(state=>state.token)
  const [messages, setMessages] = useState([]); // Store multiple messages
  const textareaRef = useRef(null);

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(user.id, id,token)
    if (response?.success) {
      if (!response?.data.isPurchased) {
        setLockCourse(true)
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress
        })
        if (response?.data?.completed) {
          console.log('bear')
          setCurrentLecture(response?.data?.courseDetails?.lectures[0])
          setShowCourseCompleteDialog(true)
          setShowConfetti(true)

          return
        }

        if (response?.data?.progress?.length === 0) {
          // console.log(response.data)
          setCurrentLecture(response?.data?.courseDetails?.lectures[0])
        } else {
          console.log('logging here')
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc
            }, -1
          )

          setCurrentLecture(response?.data.courseDetails?.lectures[lastIndexOfViewedAsTrue + 1])
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(user.id, studentCurrentCourseProgress?.courseDetails?.id, currentLecture.id,token);
      if (response?.success) {
        fetchCurrentCourseProgress()
      }
    }
  }


  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(user.id, studentCurrentCourseProgress?.courseDetails?.id,token)

    if (response?.success) {
      setCurrentLecture(null)
      setShowConfetti(false)
      setShowCourseCompleteDialog(false)
      fetchCurrentCourseProgress()
    }

  }

  useEffect(() => {
    fetchCurrentCourseProgress()
  }, [id])
  useEffect(() => {
    console.log(studentCurrentCourseProgress, 'prooooooo')
  }, [studentCurrentCourseProgress])

  useEffect(() => {
    console.log(currentLecture, 'currrrrrlec')
    if (currentLecture?.progressValue === 1) {
      updateCourseProgress()
    }
  }, [currentLecture])

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [showConfetti])

  useEffect(() => {
    window.scrollTo(0, 0);  // This will scroll to the top of the page
  }, []);

  // console.log(currentLecture," progress")




  const sendPrompt = async () => {
    if (!prompt.trim()) {
      return; // Do nothing if the prompt is empty or only whitespace
    }
    setLoading(true);
    const rs = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: "deepseek-r1:1.5b",
        prompt: prompt.trim(),
        stream: true,
        keep_alive: 0,
      }),
    });
  
    if (!rs.body) return alert("No response body");
  
    const reader = rs.body.getReader();
    const decoder = new TextDecoder();
    let responseText = ""; // Collecting the entire response
  
    // Add user message to the messages state
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', text: prompt.trim() }
    ]);
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
  
      const chunk = decoder.decode(value, { stream: true });
      chunk
        .trim()
        .split("\n")
        .forEach((el) => {
          if (el) {
            const data = JSON.parse(el);
            const cleanedResponse = data.response.replace(/<think>\s*<\/think>/g, '').replace(/<think>.*?<\/think>/g, '');
            responseText += cleanedResponse; // Append chunk to the response
          }
        });
    }
  
    // Once the response is complete, update the messages with the model response
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'llm', text: responseText.split("</think>")[1] } // Keep your line intact here
    ]);
  
    setLoading(false); // Stop loading once all data is processed
    setPrompt("");     // Clear the prompt
  };
  
  
  const hdlSubmit = (e) => {
    e.preventDefault();
    sendPrompt();

  };

  
  
  const hdlClear = () => {
    setPrompt("");
    setResp("");
  };

  const clearChat = () => {
    setMessages([]); // Reset the messages array to clear the chat
  };




 useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on content
    }
  }, [prompt]); // Trigger this effect whenever prompt changes


  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTo({ top: divRef.current.scrollHeight });
    }
  }, [resp]);

  return (
    <div className='flex  flex-col overflow-y-auto bg-slate-900 text-white' >
      {
        showConfetti && <ReactConfetti />
      }
      <div className=' sticky  flex items-center justify-between p-4 bg-slate-600 border-b border-b-gray-200 ' >
        <div className='  flex items-center space-x-4' >
          <Button
            onClick={() => navigate("/student/student-courses")}
            className='text-black bg-slate-200 '
            variant="ghost"
            size="sm"

          >
            <ChevronLeft className='h-4 w-4 mr-2' />
            Back to My Courses Page
          </Button>
          <h1 className='text-lg font-bold hidden md:block ' >
            {
              studentCurrentCourseProgress?.courseDetails?.title
            }
          </h1>
        </div>
        <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)} >
          {
            isSideBarOpen
              ? <ChevronRight className='h-5 w-5' /> : <ChevronLeft className='h-5 w-5' />
          }
        </Button>
      </div>
      <div className="flex ">
        <div className={` flex flex-1 overflow-hidden   `} >
          <div className={`flex-1  transition-all duration-300  `} >
            <VideoPlayer width='100%' height='500px' url={currentLecture?.videoUrl}
              onProgressUpdate={setCurrentLecture}
              progressData={currentLecture} />
            <div className={`mt-5 `}>
              <h2 className='text-2xl font-bold mb-2 ' >{currentLecture?.title}</h2>

            </div>
          </div>

        </div>
        <div className={` transition-all duration-300 ease-in-out  bg-slate-600 ${isSideBarOpen ? 'w-96' : ' w-0'}  `}>
          <div className={`  top-[69px] right-0 bottom-0 basis-[400px] h-svh 
                border-l border-gray-700 transition-all duration-300 
                 `}  >
            <Tabs defaultValue='content' className='h-14' >
              <TabsList className='grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14'>
                <TabsTrigger value="content" className=' text-black rounded-none h-full bg-gray-200 ' >Course Content</TabsTrigger>
                <TabsTrigger value="overview" className=' text-black rounded-none h-full bg-gray-200 '  > Ask Ai </TabsTrigger>
              </TabsList>
              <TabsContent value="content" >
                <ScrollArea className="h-full" >
                  <div className='p-4 space-y-4' >
                    {
                      studentCurrentCourseProgress?.courseDetails?.lectures.map(item =>
                        <div className='flex items-center space-x-2 text-sm text-white font-bold cursor-pointer' key={item.id} >
                          {
                            studentCurrentCourseProgress?.progress?.find(progressItem => progressItem.lectureId === item.id)?.viewed ?
                              <Check className='h-4 w-4 text-green-500' /> : <Play className='h-4 w-4' />
                          }
                          <span>{item?.title}</span>
                        </div>
                      )
                    }
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="overview" className="flex-1 overflow-hidden"  >
                <ScrollArea className="h-full" >
                  <div className='p-4' >
                    {/* <h2 className='text-xl font-bold mb-4 ' >About this course</h2>
                    <p className='text-gray-400' >
                      {studentCurrentCourseProgress?.courseDetails?.description}
                    </p> */}




                                  {/* test lllm */}
                                  <div className="">
      {/* Chat Content Section - Shows above the form */}
     {/* Chat Content Section - Shows above the form */}
     <div ref={divRef} className="mb-16 overflow-y-auto max-h-[calc(100vh-250px)]">
  {messages.map((message, index) => (
    <div
      key={index}
      className={`card shadow-xl mt-5 ${
        message.type === 'user'
          ? 'bg-blue-200 text-right self-end' // User message (blue background, aligned to right)
          : 'bg-green-200 text-left self-start' // AI message (green background, aligned to left)
      }`}
    >
      <div className="card-body text-black">
        <ReactMarkdown>{message.text}</ReactMarkdown>
      </div>
    </div>
  ))}
</div>

      {/* Fixed Form at the Bottom */}
      <form onSubmit={hdlSubmit} className=" fixed  ml-5 bottom-4 p-4 bg-white shadow-lg rounded-lg flex items-center gap-2 mx-auto">
      <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="p-2 border-2 border-solid border-gray-300 text-black resize-none w-full h-auto"
          placeholder="Type here"
          rows="1"
          disabled={loading}
        />
        <button
          className={`btn btn-primary btn-sm `}
          disabled={loading}
        >
          {loading ? <div className="loading"></div> : <ArrowBigUp />}
        </button>
        <button
          onClick={clearChat}
          className="btn btn-secondary btn-sm"
        >
          Clear
        </button>
      </form>
    </div>





                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Dialog open={lockCourse} >
        <DialogContent className='sm:w-[425px]' >
          <DialogHeader>
            <DialogTitle>You cant view this page</DialogTitle>
            <DialogDescription>
              Please purchase this course to get access
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={showCourseCompleteDialog} onOpenChange={() => setShowCourseCompleteDialog(false)} >
        <DialogContent showOverlay={false} className='sm:w-[425px]' >
          <DialogHeader>
            <DialogTitle>Congratulations</DialogTitle>
            <DialogDescription className='flex flex-col gap-3' >
              <Label>You have completed this course</Label>
              <div className='flex flex-row gap-3' >
                <Button onClick={() => navigate('/student/student-courses')} >My Courses</Button>
                <Button onClick={handleRewatchCourse} >Rewatch Courses</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default StudentViewCourseProgressPage









// <Dialog open={lockCourse} >
// <DialogContent className='sm:w-[425px]' >
//     <DialogHeader>
//         <DialogTitle>You cant view this page</DialogTitle>
//         <DialogDescription>
//             Please purchase this course to get access
//         </DialogDescription>
//     </DialogHeader>
// </DialogContent>
// </Dialog>
// <Dialog open={showCourseCompleteDialog} >
// <DialogContent showOverlay={false} className='sm:w-[425px]' >
//     <DialogHeader>
//         <DialogTitle>Congratulations</DialogTitle>
//         <DialogDescription className='flex flex-col gap-3' >
//             <Label>You have completed this course</Label>
//             <div className='flex flex-row gap-3' >
//                 <Button onClick={() => navigate('/student-courses')} >My Courses</Button>
//                  <Button onClick={handleRewatchCourse} >Rewatch Courses</Button>
//             </div>
//         </DialogDescription>
//     </DialogHeader>
// </DialogContent>
// </Dialog>


