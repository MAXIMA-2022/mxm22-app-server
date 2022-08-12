exports.createAttendanceCode = (name) => {
    const randomNumber = Math.floor(Math.random() * (999 - 100 + 1) + 100)
    const code = name.split(' ').join('').slice(0, 3)  
    const attendanceCode = `${code}${randomNumber}`
  
    return attendanceCode
}

exports.toTitleCase = (name) => {
    return name.replace(
      /\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      }
    )
}

exports.createAttendanceTime = () => {
    const today = new Date()

    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    const hour = `${today.getHours()}`.padStart(2, '0')
    const minute = `${today.getMinutes()}`.padStart(2, '0')
    const second = `${today.getSeconds()}`.padStart(2, '0')
  
    const attendanceTime = `${yyyy}-${mm}-${dd} ${hour}:${minute}:${second}`
    return attendanceTime
}

exports.generateVideoID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
}