import React from 'react'
import "./InputReason.css"
function InputReason() {
  return (
    <form className= "input-reason__container">
        <label className="input-reason__label">
            <textarea className="input-reason-form"  name="name" placeholder='Nhập lý do (*)'/>
        </label>
        <div className="input-reason__submit">
            <input type="submit" className="orange fontsubmit" value="Không duyệt" />
            <input type="submit" className="green fontsubmit" value="Gửi duyệt lại" />
        </div>
    </form>
  )
}

export default InputReason