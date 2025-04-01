import React, { useContext, useRef, useState } from 'react';
import {
  mediaUploadService,
  mediaDeleteService,
} from '../../../../api/cloudinary'; // adjust import paths
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import VideoPlayer from '@/components/VideoPlayer';
import { InstructorContext } from '@/context/instructor-context/InstructorContext';
import { courseCurriculumIntialFormData } from '@/config/createCourseFormControl';
import MediaProgressbar from '@/components/mediaProgressBar';

function CourseCurriculum(){

  const {courseCurriculumFormData, 
      setCourseCurriculumFormData,
      mediaUploadProgress,
      setMediaUploadProgress,
      mediaUploadProgressPercentage,
      setMediaUploadProgressPercentage} = useContext(InstructorContext)

  const handleNewLecture = ()=>{
      setCourseCurriculumFormData([
          ...courseCurriculumFormData,
          {
              ...courseCurriculumIntialFormData[0]
          }
      ])
  }
  
  function handleCourseTitleChange(event,currentIndex){
      let cpyCourseCurriculumFormData = [...courseCurriculumFormData]
      cpyCourseCurriculumFormData[currentIndex]={
          ...cpyCourseCurriculumFormData[currentIndex],
          title : event.target.value
      }
      setCourseCurriculumFormData(cpyCourseCurriculumFormData)
  }

  function handleFreePreviewChange(currentValue,currentIndex){
      console.log(currentValue,currentIndex)
      let cpyCourseCurriculumFormData = [...courseCurriculumFormData]
      cpyCourseCurriculumFormData[currentIndex]={
          ...cpyCourseCurriculumFormData[currentIndex],
          freePreview : currentValue
      }
      setCourseCurriculumFormData(cpyCourseCurriculumFormData)
  }

   async function handleSingleLectureUpload(event,currentIndex){
      console.log(event.target.files);
      const selectedFile = event.target.files[0];
      if(selectedFile){
          const videoFormData = new FormData();
          videoFormData.append('file',selectedFile)
          try{
              setMediaUploadProgress(true)
              const response = await mediaUploadService(videoFormData,setMediaUploadProgressPercentage)
              if(response.success){
                  let cpyCourseCurriculumFormData = [...courseCurriculumFormData]
                  cpyCourseCurriculumFormData[currentIndex]={
                      ...cpyCourseCurriculumFormData[currentIndex],
                      videoUrl : response?.data?.url,
                      public_id : response?.data?.public_id
                  }
                  setCourseCurriculumFormData(cpyCourseCurriculumFormData)
                  setMediaUploadProgress(false)
              }
              
          }catch(err){
              console.log(err)
          }
      }
  }
  console.log(courseCurriculumFormData)

  function isCourseCurriculumFormDataValid(){
      return courseCurriculumFormData.every(item=>{
          return (item && typeof item ==="object" && 
          item.title.trim() !== '' &&  item.videoUrl.trim() !== ''
          )
      })
  }

  async function handleReplaceVideo(currentIndex) {
      let cpyCourseCurriculumFormData = [...courseCurriculumFormData]
      const getCurrentVideoPublicId = cpyCourseCurriculumFormData[currentIndex].public_id
      const deleteCurrentMediaResponse = await mediaDeleteService(getCurrentVideoPublicId)
      
      if(deleteCurrentMediaResponse?.success){
          cpyCourseCurriculumFormData[currentIndex]= {
              ...cpyCourseCurriculumFormData[currentIndex],videoUrl:'',public_id:''
          }
      }
      setCourseCurriculumFormData(cpyCourseCurriculumFormData)
  }

  async function handleDeleteLecture(currentIndex){
      let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
      const getCurrentSelectedVideoPublicId =
        cpyCourseCurriculumFormData[currentIndex].public_id;
  
      const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);
  
      if (response?.success) {
        cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
          (_, index) => index !== currentIndex
        );
  
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
      }
  }
  
  return <Card>
      <CardHeader className="flex flex-row justify-between" >
          <CardTitle>
              Create Course Curriculum
          </CardTitle>

      </CardHeader>
      <CardContent>
          <Button disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress  } onClick={handleNewLecture} >Add lecture</Button>
          {
              mediaUploadProgress?
              <MediaProgressbar isMediaUploading={mediaUploadProgress} progress={mediaUploadProgressPercentage} />
              :null
          }
          <div className="mt-4 space-y-4" >
              {
                  courseCurriculumFormData.map((el,index)=>(
                      <div key={index} className="border p-5 rounded-md" >            {/* มีเพิ่ม key เอาไว้ */}
                          <div className="flex gap-5 items-center" >
                              <h3 className="font-semibold" >Lecture {index+1} </h3>
                              <Input 
                              name={`title-${index+1}`}
                              placeholder = "enter lecture title"
                              className="max-w-96"
                              onChange={event=>handleCourseTitleChange(event,index)}
                              value={courseCurriculumFormData[index]?.title}
                              />
                              <div className="flex items-center space-x-2" >
                                  <Switch onCheckedChange={(value)=>handleFreePreviewChange(value,index)} checked={courseCurriculumFormData[index]?.freePreview} id={`freePreview-${index+1}`}  />
                                  <Label htmlFor={`freePreview-${index+1}`} > Free Preview</Label>
                              </div>
                          </div>
                          <div className="mt-6" >
                              {
                                  courseCurriculumFormData[index]?.videoUrl?
                                  <div className="flex gap-3" >
                                      <VideoPlayer url={courseCurriculumFormData[index]?.videoUrl} 
                                      width="450px" height="200px" />
                                      <Button onClick={()=>handleReplaceVideo(index)} >Replace Video</Button>
                                      <Button onClick={()=>handleDeleteLecture(index)} className="bg-red-900" >Delete Lecture</Button>
                                  </div>:<Input type="file"
                              accept="video/*"
                              onChange={(event)=>handleSingleLectureUpload(event,index)}
                              className='mb-4' />
                              }
                              
                          </div>
                      </div>
                  ))
              }
          </div>
      </CardContent>
  </Card>
}
export default CourseCurriculum


