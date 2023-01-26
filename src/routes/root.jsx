import { useEffect } from "react";
import { Form, Link, Outlet, NavLink, redirect, useLoaderData, useNavigation, useSubmit } from "react-router-dom";
import { createDream, getDreams } from "../dream";

export async function action(){
    const dream = await createDream();
    return redirect(`/dreams/${dream._id}/edit`);
}

export async function loader({request}){
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const dreams = await getDreams(q);
    return {dreams, q};
}

export default function Root(){
    const {dreams, q} = useLoaderData();
    const navigation = useNavigation();
    const submit = useSubmit();

    const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

    useEffect(() => {
        document.getElementById("q").value = q;
    }, [q]);

    return (
        <>
            <div id="sidebar">
                <h1>Dream Diary</h1>
                <div>
                    <Form id="search-form" role="search">
                        <input id='q'
                            className={searching ? "loading" : ""}
                            aria-label="Search Dreams"
                            placeholder="Search"
                            name="q" 
                            defaultValue={q}
                            onChange={e => {
                                const isFirstSearch = q == null;
                                submit(e.currentTarget.form, {
                                    replace: !isFirstSearch
                                });
                            }}
                        />
                        <div id="search-spinner" aria-hidden hidden={!searching} />
                        <div className="sr-only" aria-live="polite"></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {dreams.length ? (
                        <ul>
                            {dreams.map(dream => (
                                <li key={dream._id}>
                                    <NavLink
                                        to={`dreams/${dream._id}`}
                                        className={({isActive, isPending}) =>
                                            isActive ? "active" : isPending ? "pending" : ""}>
                                        {dream.title}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p><i>No dreams</i></p>
                    )}
                </nav>
            </div>
            <div id="detail" className={navigation.state === "loading" ? "loading" : ""}>
                <Outlet />
            </div>
        </>
    );
}