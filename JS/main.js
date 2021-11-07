
var gameSize//גודלה המשחק
var totalsub = 0//צבירת כמות הצוללת הכללית
var subTypePosition = new Array()//מערך שומר לכל המיקומים של הצוללת
var subTypesNum = new Array()//כמות הצוללת לפי סוג
var allTds//כל תאי טבלת המשחק


var subInfoTd = document.querySelectorAll(`.Sub-Info`)//כל התאים בטבלת התוצאות

//תפיסת קובצי האודיו השונים
var audioHit=document.querySelector(`#audio-hit`)
var audioSunk=document.querySelector(`#audio-sunk`)
var audioWin=document.querySelector(`#audio-win`)

//כפתור הפעלת המשחק
document.querySelector(`button`).addEventListener(`click`,NewGameSetup)










