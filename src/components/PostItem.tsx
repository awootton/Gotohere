// Copyright 2021 Alan Tracey Wootton
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//import React, { ReactElement, FC, useState } from "react";
import { ReactElement, FC } from "react";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import * as s from "../gotohere/mqtt/SocialTypes"

import Box from "@material-ui/core/Box";

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'

import Typography from '@material-ui/core/Typography';
import ReactMarkdown, { propTypes } from 'react-markdown'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'

import Tooltip from '@material-ui/core/Tooltip'

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

//import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//import ExpandLessIcon from '@material-ui/icons/ExpandLess';


import * as menus_card from '../menus/CardMenu'
import * as util from '../gotohere/mqtt/Util'
import * as likesapi from "../gotohere/api1/IncrementLikes"
 

// define css-in-js
const useStyles = makeStyles((theme: Theme) =>
    createStyles({

        root: {
        },

        // title: {
        //     fontSize: 12,
        //     padding: "4px 4px",
        // },
        // pos: {
        //     marginBottom: 12,
        // },
        theTextStyle: {
            display: "flex",
            padding: "0px 0px",
            height: 120, // 

            overflow: 'auto',
            flexDirection: "column"
        },

        nopadding: {
            padding: "0px 0px",
        },

        pushedright: {
            display: "flex",
            justifyContent: "space-between" //justifyContent: "flex-end",
            //alignItems: 'center', // vertical
        },

        centered: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            alignItems: 'center', // centers vertical
        },

        button: {
            margin: "0px 0px",
            padding: "0px 0px",
            height: "20",
            width: "20"
        },

        // scrollingEdit : {
        //     overflow-y: scroll
        // }
    })
);

// define interface to represent component props
export interface Props {
    post: s.Post
    username: string
    commentsOpen: boolean
    parentOpen: boolean
    depth: number // the depth in the tree of comment indentation
    why: string // for the timeline
    toggleOpened: (ref: s.StringRef) => any
    toggleParent: (ref: s.StringRef) => any
}

export const PostItem: FC<Props> = (props: Props): ReactElement => {

    //const [state, setState] = useState(props.post)

    const classes = useStyles();

    const depth = props.depth
  
    //const hasComments = props.post.comments.length !== 0

    const getOpenButton = (post: s.Post) => {
        if (post.comments.length !== 0) {
            return (  
                <a href="#" onClick={handleCommentClick}>{props.commentsOpen ? "🔼" : "🔽" } {"  "}</a>
            )
            // return (
            //     // <div style={{  width:"12px", margin:"0 0",  padding: "0px 0px" } } >
            //     // <Tooltip title={props.commentsOpen?"Hide comments":"Show comments"}  >
            //     {/* <Button variant="contained"
            //         size="small"
            //         color="secondary"
            //         className={classes.button}
            //         style={{backgroundColor:"white", color:"black" , margin:"0 0" } }
            //         disableElevation
            //         onClick={handleCommentClick} >
            //         {/* {props.commentsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon /> } */}
            //         <a href="#" onClick={handleCommentClick}>{props.commentsOpen ? "🔼" : "🔽" } {"  "}</a>
                    
            //     {/* </Button> */}
            //     {/* </Tooltip>
            //     </div> */}
            // )
        } else {
            return (
                <></>
            )
        }
    }

    const getParentButton = (post: s.Post) => {
        if (post.parent !== undefined) {
            return (
                // <div style={{  width:"8px", margin:"0 0",  padding: "0px 0px" } } >
                <Tooltip title={props.parentOpen?"Hide parent":"Show parent"}  >
                {/* <Button variant="contained"
                    size="small"
                    color="secondary"
                    className={classes.button}
                    style={{backgroundColor:"white", color:"black" , margin:"0 0" , width:24} }
                    disableElevation
                    onClick={handleParentClick} >
                    {/* {props.commentsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon /> } */}
                <a href="#" onClick={handleParentClick}>{props.parentOpen ? "🔼" : "🔽" }{"  "}</a>
               {/* </Button> */}
                </Tooltip>
                // </div>
            )
        } else {
            return (
                <></>
            )
        }
    }

    var byLine = (depth>0) ? (props.post.by + ":" + props.post.title) : props.post.title

    if ( props.why !== "" ){
        byLine = props.why
    }

    // todo: add from  {post.from}: <b>{post.title}</b>
    // if it's a comment and name != props.username   
    const getTopLine = (post: s.Post) => {
        var dom = (
            <Box
                display="flex"
                flexDirection="row"
                p={1}
                m={1}
                bgcolor="background.paper"
                className={classes.pushedright}
                style={{height:"8px"}}
            >
                {getParentButton(post)}
                <span>{byLine}</span>
                <span className={classes.centered} >
                    {post.id !== 0 ? util.FormatDateNumber(post.id) : ""}
                </span>
                <span className={classes.pushedright} >
                    {post.id !== 0 ? (
                        <>
                            {/* {getOpenButton(post)} */}

                            <Tooltip title={post.likes.toString() + " likes"}  >

                                <Button onClick={handleClickHeart} className={classes.button} >
                                    {post.likes === 0 ? <FavoriteBorderIcon /> : <FavoriteIcon />}
                                </Button>

                            </Tooltip>
                            <menus_card.CardMenu post={post} username={props.username} />
                        </>
                    ) : (<></>)
                    }
                </span>
            </Box>
        )
        return dom
    }

    const handleClickHeart = () => {
        // should be alice, anon
        console.log("like pushed for ", props.username, " by ", util.getSignedInContext().username)
        likesapi.IssueTheCommand(props.username, props.post.id, util.getSignedInContext().username, (reply: likesapi.IncrementLikesReply, error: any) => {
            console.log("nobody really give a shit about the likes return. The action is in the broadcast event")
        })
    };

    const handleCommentClick = () => {
        props.toggleOpened(s.StringRefNew(props.post))
    }

    const handleParentClick = () => {
        props.toggleParent(s.StringRefNew(props.post))
    }

    type funtype = () => any

    const stringToFunction = ( fname: any ) : funtype => {
        if ( fname === "handleCommentClick" ){
            console.log("stringToFunction returning " + fname)
            return handleCommentClick
        }
        console.log("ERROR unhandled fname " + fname)
        return () => {}
    }

    // <a href="#" onClick={handleCommentClick}>{props.commentsOpen ? "🔼" : "🔽" } {"  "}</a>

    const renderTheCard = (post: s.Post) => {

        var posStyle = {
            marginLeft: 0
        }
        if ( depth > 0 ){
            posStyle.marginLeft = 12 * depth
        }

        var TheText = post.theText //+ " [show comments](handleCommentClick 'show/hide comments') "
        if ( props.why !== ""){
            // the why is in the title. todo: less tricky
            TheText = "**" + post.title + "**  \n" + post.theText
        }

        return (
            <>
                <Card elevation={2} className={classes.nopadding} key={post.id} style = {posStyle} >
                    <CardHeader style={{justifyContent:"center", height: "4", width:"8px", margin:"0 0",  padding: "0px 0px", marginLeft: 120  }} /> 
                    <CardContent className={classes.nopadding}  >
                        {getTopLine(post)}
                        <Typography variant="body2" color="textSecondary" component="div" className={classes.theTextStyle}  >
                            <ReactMarkdown className={classes.theTextStyle} 
                            children={TheText}
                            components={{
                                // Map `h1` (`# heading`) to use `h2`s.
                                h1: 'h4',
                                // Rewrite links to be onClick
                                a: ({node, ...props}) => <a  href="#" onClick={stringToFunction(props.href)}  >{props.children}</a>
                              }}
                            />
                            {/* {getOpenButton(post)} */}
                        </Typography>
                    </CardContent>
                    <CardActions style={{justifyContent:"center", height: "4", width:"8px", margin:"0 0",  padding: "0px 0px", marginLeft: 120  }}>
                    {getOpenButton(post)} 
                    </CardActions> 
                </Card>
            </>
        )
    }

    //const dummy = () => { }

    // if (props.post.editable) {
    //     return (
    //         <>
    //             {renderEditCard(props.post)}
    //         </>
    //     );
    // } else 
    {
        return (
            <>
                {renderTheCard(props.post)}
            </>
        );
    }
};



// type EditProps = {
//     post : social.Post
//     username: string
// }

// export const FillEditDialog: FC<EditProps> = (props: EditProps) => {

//     const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
//         const str: string = event.target.value
//         console.log("title is now ", str)
//         // const newState = {
//         //     ...state,
//         //     title: str
//         // }
//         // setState(newState)
//     }
//     const handleBodyChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
//         const str: string = event.target.value
//         console.log("body is now ", str)
//         // const newState = {
//         //     ...state,
//         //     theText: str
//         // }
//         // setState(newState)
//     }

//     const classes = useStyles();

//     const renderEditCard = (post: social.Post) => {
//         return (
//             <>
//                 <Card elevation={2} className={`background-color: gray;`} key={post.id} >
//                     <TextField

//                         fullWidth
//                         id="titleeditor"
//                         type="text"
//                         label="Edit the title (if any):"
//                         placeholder={post.title}
//                         margin="normal"
//                         onChange={handleTitleChange}
//                         defaultValue={post.title}
//                         multiline={true}
//                     />
//                     <CardContent>
//                         <TextField
//                             style={{maxHeight: 200, overflow: 'auto'}}
//                             fullWidth
//                             id="contenteditor"
//                             type="text"
//                             label="Edit the item here:"
//                             placeholder={post.theText}
//                             margin="normal"
//                             onChange={handleBodyChange}
//                             defaultValue={post.theText}
//                             multiline={true}
//                         />
//                         {/* <Typography variant="body2" color="textSecondary" component="div">
//                             <ReactMarkdown>{post.theText}</ReactMarkdown>
//                         </Typography> */}
//                     </CardContent>
//                     <CardActions>
//                         <Button variant="contained" onClick={ () => {} } >Save</Button>
//                     </CardActions>
//                 </Card>
//             </>
//         )
//     }
//     return (
//         <>
//              {renderEditCard(props.post)}
//         </>
//     )
// }



export default PostItem;
