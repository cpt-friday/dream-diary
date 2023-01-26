import axios from 'axios';
import {Buffer} from 'buffer';

const bEncode = string => {
    let sBuf = Buffer.from(string, 'utf-8');
    return sBuf.toString('base64');
}

const bDecode = string => {
    let bBuf = Buffer.from(string, 'base64');
    return bBuf.toString('utf-8');
}

const api = axios.create({
    baseURL: 'http://localhost:9000/api',
    headers: {'Access-Control-Allow-Origin': '*'}
});

let DreamIds = [];
let DreamSize;

export default function Test(){
    const handleSubmit = async e => {
        e.preventDefault();
        const elems = e.target.elements;
        const inTitle = elems.title.value;
        const inDate = elems.date.value;
        const inBodyCode = bEncode(elems.bodyField.value);
        const newDream = {
            title: inTitle,
            date: inDate,
            bodyCode: inBodyCode
        };
        let newId;
        await api.post('/dream').then(res => {    
            newId = res.data.id;
        });
        await api.put(`/dream/${newId}`, newDream).then(res => {
            console.log(res.data);
        });
    }
    const handleGetAll = async () => {
        let Dreams;
        DreamIds = [];
        await api.get('/dreams').then(res => {
            Dreams = res.data.data;
            Dreams.map(dream => {
                DreamIds.push(dream._id);
            });
            DreamSize = Dreams.length;
            console.log(DreamIds);
            console.log(`There are ${DreamSize} dreams`);
        }).catch(err => {
            if(err.response.status === 404) console.log(`No dreams found`);
            else console.log(`Unknown error`);
        })
    }
    const handleNewOne = () => {
        api.post('/dream');
    }
    const handleDelete = async e => {
        e.preventDefault();
        const elems = e.target.elements;
        const index = Number(elems.dIndex.value);
        if(isNaN(index) || index < 0 || index >= DreamSize){
            alert('Invalid');
            return;
        }
        const deleteId = DreamIds[index];
        await api.delete(`/dream/${deleteId}`).then(res => {
            console.log('Successfully deleted dream!');
        }).catch(err => {
            if(err.response.status === 404) console.log(`Requested dream couldn't be found`);
            else console.log(`Unexpected error\nRun 'Get All' before trying again`);
        })
    }
    const handleGetOne = async e => {
        e.preventDefault();
        const elems = e.target.elements;
        const index = Number(elems.dIndex.value);
        if(isNaN(index) || index < 0 || index >=DreamSize){
            alert('Invalid');
            return;
        }
        const retrieveId = DreamIds[index];
        await api.get(`/dream/${retrieveId}`).then(res => {
            const result = res.data.data;

            console.log(`Title: ${result.title}\nDate: ${result.date}\nBody: ${bDecode(result.bodyCode)}`);
        }).catch(err => {
            if(err.response.status === 404) console.log(`Dream could not be found`);
            else console.log(`You need to run 'Get All' first`);
        })
    }
    return (
        <>
        <h1>API Test</h1>
        <p>Click on the buttons to test the different API methods</p>
        <hr/>
        <form onSubmit={handleSubmit}>
            <input type='text' placeholder="Enter title here" name='title'/>
            <input type='date' name='date' />
            <textarea placeholder="Enter body here" name='bodyField' />
            <button type='submit'>Submit</button>
        </form>
        <button onClick={handleGetAll}>Get All</button>
        <button onClick={handleNewOne}>New Dream</button>
        <hr />
        <form onSubmit={handleDelete}>
            <span>Select index of dream to delete</span>
            <input type='number' name='dIndex'/>
            <button type='submit'>Delete</button>
        </form>
        <hr/>
        <form onSubmit={handleGetOne}>
            <span>Select index of dream to retrieve</span>
            <input type='number' name='dIndex'/>
            <button type='submit'>Retrieve</button>
        </form>
        </>
    )
}