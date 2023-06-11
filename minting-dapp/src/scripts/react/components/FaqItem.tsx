import React, { FC } from 'react'
interface Props {
  ques: String
  ans: String
  index: any
}

const FaqItem: React.FC<Props> = ({ ques, ans, index }) => {
  return (
    <div className="row">
      <div className="col">
        <div className="tabs shadow bg-[#000813] rounded">
          <div className="tab">
            <input type="checkbox" id={index} />
            <label className="tab-label" htmlFor={index}>
              {ques}
            </label>
            <div className="tab-content bg-gray-900 text-gray-400">{ans}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FaqItem
