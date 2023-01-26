import axios from 'axios';
import {Buffer} from 'buffer';
import {matchSorter} from 'match-sorter';
import sortBy from 'sort-by';

export function bEncode(string){
    let sBuf = Buffer.from(string, 'utf-8');
    return sBuf.toString('base64');
}

export function bDecode(string){
    let bBuf = Buffer.from(string, 'base64');
    return bBuf.toString('utf-8');
}

const api = axios.create({
    baseURL: 'http://localhost:9000/api',
    headers: {'Access-Control-Allow-Origin': '*'}
});

export async function getDreams(query){
    //figure out searching stuff later
    let dreamList;
    await api.get('/dreams').then(res => {
        dreamList = res.data.data;
    }).catch(err => {
        if(err.response.status === 404) dreamList = [];
        else return;
    });
    if(query){
        dreamList = matchSorter(dreamList, query, {keys: ["title"]});
    }
    return dreamList.sort(sortBy("title", "createdAt"));
}

export async function createDream(){
    let newId, newDream;
    await api.post('/dream').then(res => {
        newId = res.data.id;
    });
    newDream = await getDream(newId);
    return newDream;
}

export async function getDream(id){
    let foundDream;
    await api.get(`/dream/${id}`).then(res => {
        foundDream = res.data.data;
    }).catch(err => {
        foundDream = null;
    });
    return foundDream;
}

export async function updateDream(id, updates){
    let updatedDream;
    await api.put(`/dream/${id}`, updates).catch(err => {
        if(err.response.status === 404) console.log(`No dream found for ${id}`);
        else console.log(`Unknown error`);
        return;
    });
    updatedDream = await getDream(id);
    return updatedDream;
}

export async function deleteDream(id){
    let isGone;
    await api.delete(`/dream/${id}`).then(res =>{
        isGone = true;
    }).catch(err => {
        isGone = false;
    });
    return isGone;
}