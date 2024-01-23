import React from 'react'
import { Accordion, CardGroup, Stack, Table } from 'react-bootstrap'
import PlaylistItem from './PlaylistItem'

const PlaylistList=({playlists,isStudio})=>{
    if(playlists.length===0) return <h1>У пользователя нет плейлистов</h1>
return(

    // <Accordion defaultActiveKey="0">
    //      {playlists.map((e)=>(
    //         <PlaylistItem key={e.id} isStudio={isStudio} id={e.id} playlist={e}/>
    //     ))}
    // </Accordion>
    <div>
          {playlists.map((e)=>(
            <PlaylistItem key={e.id} isStudio={isStudio} id={e.id} playlist={e}/>
        ))}
          
          
        <Table></Table>
        
    </div>
)
}

export default PlaylistList