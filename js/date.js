//var monthtext=['January','February','March','April','May','June','July','August','September','October','November','December'];
//function populatedropdown(dayfield, monthfield, yearfield){
//	var today=new Date()
//	var dayfield=document.getElementById(dayfield);
//	var monthfield=document.getElementById(monthfield);
//	var yearfield=document.getElementById(yearfield);
//	for (var i=0; i<31; i++)
//		dayfield.options[i]=new Option(i+1, i+1)
//	dayfield.options[today.getDate()-1].selected=true;
//	for (var m=0; m<12; m++)
//		monthfield.options[m]=new Option(monthtext[m], monthtext[m])
//	monthfield.options[today.getMonth()].selected=true;
//	var thisyear=today.getFullYear()
//	for (var y=0; y<20; y++){
//		yearfield.options[y]=new Option(thisyear, thisyear)
//		thisyear+=1
//	}
//yearfield.options[0]=new Option(today.getFullYear(), today.getFullYear(), true, true) //select today's year
//}
//onload=function(){
//	 populatedropdown('d', 'm', 'y')
//}
//
//var d, m, y;
//function changeDay(ev)
//{
//    d = ev.value;
//    console.log("Day: ", d);
//}
//
//function changeMonth(ev)
//{
//    m = ev.value;
//    console.log("Month: ", m);
//}
//
//function changeYear(ev)
//{
//    y = ev.value;
//    console.log("Year: ", y);
//    console.log("DATE: ", d+": "+m+": "+y);    
//}