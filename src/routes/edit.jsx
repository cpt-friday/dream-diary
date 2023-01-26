import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { bDecode, bEncode, updateDream } from "../dream";

export async function action ({request, params}){
    const formData = await request.formData();
    const updates = {
        title: formData.get('title'),
        date: formData.get('date'),
        bodyCode: bEncode(formData.get('body'))
    };
    await updateDream(params.dreamId, updates);
    return redirect(`/dreams/${params.dreamId}`);
}

export default function EditDream(){
    const dream = useLoaderData();
    const navigate = useNavigate();
    return (
        <Form method="post" id="dream-form">
            <p>
                <span>Title</span>
                <input placeholder="Title"
                    aria-label="Dream Title"
                    type="text"
                    name="title"
                    defaultValue={dream.title}
                />
            </p>
            <label>
                <span>Date</span>
                <input type="date"
                    defaultValue={dream.date ? dream.date : "1999-12-31"}
                    aria-label="Dream Date"
                    name="date"
                />
            </label>
            <label>
                <span>Body</span>
                <textarea
                    name="body"
                    defaultValue={dream.bodyCode ? bDecode(dream.bodyCode) : ""}
                    rows={6}
                />
            </label>
            <p>
                <button type="submit">Save</button>
                <button type="button" onClick={() => navigate(-1)}>Cancel</button>
            </p>
        </Form>
    );
}