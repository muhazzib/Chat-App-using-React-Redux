let initialstate={
    name:"",
    errormessage:'',
    errorflag:false,
    useruid:'',
    email:'',
    AllUserData:[],
    Conversations:[]
}

export let AuthReducer=(state=initialstate,test)=>{
switch(test.type){
    case "SettingUserData" :
    return({
        ...state,name:test.name,useruid:test.useruid,email:test.email
    })
    break;
  




    
            break;
    case "AllUserData" :

    
    return Object.assign({},...state,{AllUserData:[...state.AllUserData,test.AllUserDataReducer]})
  
    break;
  

    case "Logout" :
    return initialstate
    
        break;


    case 'error':

    // console.log(test)
    return(
        {
            ...state,errormessage:test.errormessage,errorflag:test.errorflag
        }
    )
    break;

    
    case 'errorFalse':
    return(
        {
            ...state,errorflag:test.errorflag
        }
    )
    default:
    return state
}

}


export function SendMessage(state = {allarray:[]}, test){
    switch(test.type){
        case 'ClearState' :
     return    state
        case 'SendMessage':
return ({
allarray:test.conversation
})
    
//   return      Object.assign([],[...state,test.conversation])
            // return test.conversation;
        default:
            return state;
    }
} 
// export let ErrorMessage=(state,test)=>{
// return(
//     test
// )
// }






