

//קביעת גודל המשחק והצוללות בזמן לחיצת הכפתור
function NewGameSetup() {

    gameSize = parseInt(document.querySelector("input[name=Game-Size]:checked").dataset.size)//קבלת גודל המשחק המבוקש
    let subs = document.querySelectorAll(`.SubType`)//סוג צוללת מוקלד

    for (let i = 0; i < subs.length; i++) {
        //הגבלת ערכי הצוללות כאשר ננסה לכתוב ערך מעל המקסימום או מתחת ל0
        if (subs[i].value > subs[i].max)
            subs[i].value = subs[i].max
        else if (subs[i].value < subs[i].min)
            subs[i].value = subs[i].min
        subTypesNum[i] = parseInt(subs[i].value) ///<--שמירת ערך כמות הצללות המבוקשת לכל סוג
        subInfoTd[i].innerHTML = subTypesNum[i]//איתחול טבלת התוצאות לפי כמות כל סוג צוללת

    }
    totalsub = subTypesNum.reduce((a, b) => a + b)//סכימת כמות הצוללת הכללית
    if (totalsub == 0) {
        alert(`No Subs! The Game Will Reload`)
        window.location.reload()
        return
    }

    BuildTable()//יצירת הטבלה
    let button = document.querySelector(`#setupDiv button`)//תפיסה של הכפתור ושנויו לאיפוס המשחק לאחר התחלת הממשחק
    button.textContent = `Reset Game`
    button.setAttribute(`onClick`, `window.location.reload()`)
}
//בניית טבלת המשחק
function BuildTable() {
    let table = `<table>`
    let cell = 0//מיספור כל התאים בטבלה
    for (let tr = 0; tr < gameSize; tr++) {
        table += `<tr>`
        for (let td = 0; td < gameSize; td++) {
            if (td == 0)//כל תא ראשון בשורה יקבל דטה של גבול כדי לא לרדת שורה
                table += `<td data-boundX="true" data-cell="${cell}"></td>`
            else {
                table += `<td data-cell="${cell}"></td>`
            }
            cell++
        }
        table += `</tr>`
    }
    table += `</table>`
    document.querySelector(`#gameTable`).innerHTML = table
    SetTableClicks()//יצירת לחיצה על התאים בטבלה
    SetSubs()//יצירת מיקום צללות רנדומלי
}
function SetTableClicks() {

    allTds = document.querySelectorAll(`#gameTable td`)//תפסית ארוע לחיצה על תא בטבלה
    for (var i = 0; i < allTds.length; i++) {
        allTds[i].addEventListener(`click`, MouseClickHandler)
    }
}
function SetSubs() {
    for (let i = 0; i < subTypesNum.length; i++) {// לולאה על כל סוגי הצוללות
        for (let j = 0; j < subTypesNum[i]; j++) {//לולאה לסוג צללות מסויים
            while (!(SubCreator(i))) { }//יצירת צוללת אחת מסוג מסויים
        }
    }
}
function SubCreator(subtype) {
    let randomSubs = Randomizer()//יצירת מיקום רנדומלי
    let randomAxis = Math.floor(Math.random() * 2)//יצירת מספר רנדומלי בין 0-1 שמייצג את צורת הצוללת
    let nextPos = 0;
    for (let i = 0; i < subtype + 2; i++) {//בדיקה אם אפשר להכניס צוללת המיקום הנוכחי
        if (allTds[randomSubs + nextPos] == undefined)//בדיקה שלא עוברים את גודל הטבלה
            return false

        else if (allTds[randomSubs + nextPos].getAttribute(`data-sub`)) {//אם קיימת צוללת במיקום הנוכחי
            return false
        }
        else if (i > 0 && allTds[randomSubs + nextPos].getAttribute("data-boundX") && randomAxis != 1) {//אם הצוללת גדולה יותר מהשורה
            return false
        }
        if (randomAxis == 1)
            nextPos += gameSize;
        else
            nextPos++

    }
    nextPos = 0
    for (let i = 0; i < subtype + 2; i++) {//יצירת הצוללת
        allTds[randomSubs + nextPos].setAttribute(`data-sub`, `${subtype + 2}`)//סימון גודל הצוללת
        allTds[randomSubs + nextPos].setAttribute(`data-Sub-Start`, `${randomSubs}`)//סימון תחילת הצוללת
        allTds[randomSubs + nextPos].setAttribute(`data-axis`, `${randomAxis}`)//סימון צורת הצוללת
        if (randomAxis == 1)
            nextPos += gameSize;
        else
            nextPos++

    }
    return true
}
function Randomizer() {
    let random = Math.floor(Math.random() * gameSize * gameSize)
    while (subTypePosition.indexOf(random) != -1) {//אם המיקום קיים כבר במערך נגריל מספר חדש
        random = Math.floor(Math.random() * gameSize * gameSize)
    }
    subTypePosition.push(random)// שמירת כל המיקומים של הצוללות או מיקומים בלתי אפשרים כדי לא לחזור אליהם
    return random
}
function MouseClickHandler(event) {
    let element = event.target
    IsHit(element)//בדיקה האם פגענו בצוללת
}
function IsHit(element) {
    let subType = element.getAttribute("data-sub")//שמירת גודל הצוללת אם קיים
    if (subType) {//אם התא מסומן כצוללת
        element.classList.add(`hit`)//צביעת התא באדום
        PlaySound(audioHit, audioHit)

        if (IsSunk(element, subType))//בדיקה האם כל הצוללת נפגעה
            IsWin(element)
    }
    else
        element.classList.add(`sea`)//אם אין צוללת במיקום הנוכחי נצבע את התא בכחול
}
function IsSunk(element, subType) {
    let subStart = parseInt(element.getAttribute("data-Sub-Start"))//שמירת מיקום התחלת הצוללת
    let subAxis = element.getAttribute("data-axis")
    let nextPos = 0
    for (let i = 0; i < subType; i++) {//מעבר על כל אורך הצוללת ובדיקה האם כל התאים נלחצו כבר
        if (!(allTds[subStart + nextPos].classList.contains(`hit`)))
            return false
        if (subAxis == 1)//אם הצוללת לאורך התא הבא הוא כגודל המשחק
            nextPos += gameSize;
        else
            nextPos++
    }
    PlaySound(audioSunk, audioHit)
    nextPos = 0
    //לולאה להורדת הדאטה של הצוללת שהוטבעה והשמת תמונה קטנה בתוכה
    for (let i = 0; i < subType; i++) {
        allTds[subStart + nextPos].innerHTML = `<img src="./images/boom.png">`//הכנסת תמונה לתאים של הצוללת המפוצצת
        allTds[subStart + nextPos].removeAttribute("data-sub")//מחיקת מאפיין הדאטה של גודל הצוללת כדי שלא נפוצץ את אותה הצוללת פעמיים
        if (subAxis == 1)
            nextPos += gameSize;
        else
            nextPos++
    }
    totalsub--
    ScoreBoard(subType)
    return true
}
function IsWin() {
    let imgDiv = document.querySelector(`.imageDiv`)//תפיסת הדיב של התמונה
    if (totalsub != 0) {//אם לא ניצחנו אך רק פוצצנו צוללת
        imgDiv.innerHTML = `<img class="boomImg" src="./images/boombig.png">`//השמת תמונה פיצוץ צוללת
        let img = document.querySelector(`.imageDiv img`)//תפיסת התמונה שיצרנו
        setTimeout(function () { img.parentNode.removeChild(img) }, 2000)//הצגתה ל2 שניות והסרתה
    }
    else {//אם ניצחנו
        imgDiv.innerHTML = `<img class="winImg" src="./images/win.png">`//הצגת תמונת ניצחון
        PlaySound(audioWin, audioSunk)//השמעת צליל נצחון

    }
}
function ScoreBoard(subType) {//פונקציה של טבלת התוצאות
    subInfoTd[subType - 2].innerHTML--//הורדת ערך הצוללת הנכונה
    subInfoTd[subType - 2].classList.add(`minus`)//הוספת קלאס שיצבע אותו
    if (subInfoTd[subType - 2].innerHTML != 0)//אם נשארו עוד צוללת מהסוג הזה
        setTimeout(function () { subInfoTd[subType - 2].classList.remove(`minus`) }, 500);//נוריד את הצבע לאחר חצי שנייה
}
//פונקציה להשמעת הצלילים
async function PlaySound(sound, stopLast) {
    await stopLast.pause()
    sound.currentTime = 0;
    await sound.play()
}
