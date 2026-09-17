
import moment from "moment";


export const createEventFromTask = (entry) => {
    const startDateTime = new Date(`${entry.WorkDate}T${entry.WorkStartTime}`);
    const endDateTime = new Date(`${entry.WorkDate}T${entry.WorkEndTime}`);
  
    return {
      id: entry.TimeSheetId,
      title: `${entry.ProjectName} - ${entry.WorkTitle}`,
      start: startDateTime,
      end: endDateTime,
      description: entry.WorkDetails,
      resourceId: entry.resourceId,
    };
  };
  
  // Usage:
 // const events = tasks.map(createEventFromTask);

 // Callback for "user" flag
 export const calculateTimePerDay = (tasks) => {
   const timeSpent = {};
 
   tasks.forEach((item) => {
     const startDateTime = moment(`${item.WorkDate}T${item.WorkStartTime}`);
     const endDateTime = moment(`${item.WorkDate}T${item.WorkEndTime}`);
     const duration = moment.duration(endDateTime.diff(startDateTime)).asSeconds();
 
     const date = item.WorkDate;
 
     if (!timeSpent[date]) {
       timeSpent[date] = duration;
     } else {
       timeSpent[date] += duration;
     }
   });
 
   return formatTimeSpent(timeSpent);
 };
 
 // Callback for "manager" or "admin" flag
 export const calculateTimePerResourceAndDay = (tasks) => {
   const timeSpent = {};
 
   tasks.forEach((item) => {
     const startDateTime = moment(`${item.WorkDate}T${item.WorkStartTime}`);
     const endDateTime = moment(`${item.WorkDate}T${item.WorkEndTime}`);
     const duration = moment.duration(endDateTime.diff(startDateTime)).asSeconds();
 
     const date = item.WorkDate;
     const resourceId = item.resourceId;
 
     if (!timeSpent[resourceId]) {
       timeSpent[resourceId] = {};
     }
 
     if (!timeSpent[resourceId][date]) {
       timeSpent[resourceId][date] = duration;
     } else {
       timeSpent[resourceId][date] += duration;
     }
   });
 
   // Format each resource's time spent
   const formattedTimeSpent = {};
   Object.keys(timeSpent).forEach((resourceId) => {
     formattedTimeSpent[resourceId] = formatTimeSpent(timeSpent[resourceId]);
   });
 
   return formattedTimeSpent;
 };
 
 // Utility function to format time spent into HH:mm:ss
 export const formatTimeSpent = (timeSpent) => {
   const formattedTime = {};
   Object.keys(timeSpent).forEach((key) => {
     const totalSeconds = timeSpent[key];
     const hours = Math.floor(totalSeconds / 3600);
     const minutes = Math.floor((totalSeconds % 3600) / 60);
     const seconds = totalSeconds % 60;
 
     formattedTime[key] = `${hours.toString().padStart(2, "0")}:${minutes
       .toString()
       .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
   });
   return formattedTime;
 };
 
 // Main function to calculate time based on flag
 export const calculateTotalTimePerDay = (tasks, flag) => {
   switch (flag) {
     case "User":
       return calculateTimePerDay(tasks);
     case "Manager":
     case "Admin":
       return calculateTimePerResourceAndDay(tasks);
     default:
       throw new Error(`Invalid flag value: ${flag}`);
   }
 };
 
 // Usage
 //const totalTimeSpent = useMemo(() => calculateTotalTimePerDay(tasks, flag), [tasks, flag]);
 