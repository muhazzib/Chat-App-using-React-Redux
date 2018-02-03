import { database } from '../../fire'

export let loginfunc = (obj) => {


    let credentials = {
        type: 'login',
        email: obj.name,
    }

    return (
        credentials
    )

}


export let SendingUserData = (obj) => {
    let credentials = {
        type: 'SettingUserData',
        email: obj.email,
        name: obj.name,
        useruid: obj.useruid
    }

    return (
        credentials
    )
}



export let SendingAllUserData2 = () => {
    return (dispatch) => {
        database.child('userConvo/').on("child_added", function (snapshot) {
            let CurrentUser = JSON.parse(localStorage.getItem('UserData')).uid
            let obj = snapshot.val()
            obj.key = snapshot.key
            if (obj.useruid !== CurrentUser) {
                dispatch(FinalSendingAllUserData2(obj));
            }
        })

    }

}

export function FinalSendingAllUserData2(obj) {
    return {
        type: 'AllUserData',
        AllUserDataReducer: obj
    }
}




export let errorReducerFunc = (error) => {
    return (
        {
            type: 'error',
            errormessage: error.error,
            errorflag: true
        }
    )
}


export let errorReducerCloseFunc = () => {
    return (
        {
            type: 'errorFalse',
            errorflag: false
        }
    )
}


export let LogoutAction = () => {
    return (
        {
            type: 'Logout'
        }
    )
}

export let SendMessageAction = (MessageObj) => {
    let DBMessageObject = {
        senderUid: MessageObj.senderUid,
        receiverUid: MessageObj.receiverUid,
        receiverName: MessageObj.receiverName,
        senderName: MessageObj.senderName,
        Message: MessageObj.Message,
        AMessagedate: new Date().getTime(),
        Type: 'unseen'
    }

    database.child('user').child(DBMessageObject.senderUid).child('conversations').child(DBMessageObject.receiverUid).push(DBMessageObject)
    database.child('user').child(DBMessageObject.receiverUid).child('conversations').child(DBMessageObject.senderUid).push(DBMessageObject)


    // return (dispatch) => {

    //     dispatch(FinalSendMessageAction(MessageObj))
    // }
    // return (
    //     {
    //         type: 'SendMessage'
    //     }
    // )
}
export let RenderConvo = (MessageObj) => {

    
    return (dispatch) => {
        let ConvoData = {
            senderUid: MessageObj.senderUid,
            receiverUid: MessageObj.receiverUid,
        }
        let data = []
        let dataObject = {
            Message: '',
            Messagedate: ''
        }
        let flag = false
        database.child('user').child(ConvoData.senderUid).child('conversations').child(ConvoData.receiverUid).on("child_added", function (snapshot) {
            let obj = snapshot.val()
            obj.key = snapshot.key
            // alert(obj.Message)
            data.push(obj)
            if (flag == true) {
                setTimeout(() => {
                    dispatch(FinalRenderConvo(data.reverse()))

                }, 1000)
            }
        })


        setTimeout(() => {
            dispatch(FinalRenderConvo(data.reverse()))
            flag = true
        }, 1000)
    }
    // console.log(MessageObj,"Action se")
    // return{
    //     type:'SendMessage',
    //     senderUid:MessageObj.senderUid,
    //     receiverUid:MessageObj.receiverUid,
    //     receiverName:MessageObj.receiverName,
    //     Message:MessageObj.Message
    // }
}

export let FinalRenderConvo = (obj) => {
    return {
        type: 'SendMessage',
        conversation: obj
    }
}

export let ClearState = () => {
    return {
        type: 'ClearState'

    }
}








