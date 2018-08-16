import React from 'react'

export default function FlashMessage(props) {
    return (
        <div className="flash-error">
            {props.message}
        </div>
    )
}

// set default error message
Error.defaultProps = {
    message: 'An error occured'
}