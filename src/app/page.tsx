"use client";

import {FormEvent, useEffect, useState} from "react";

import Editor from "@monaco-editor/react";
import YAML from 'yaml';
import {convertToAutoUpstall} from "@/app/utils/converter";

export default function Home() {
    const [compose, setCompose] = useState("");
    const [composeYaml, setComposeYaml] = useState({} as Record<string, any>);
    const [autoUpstall, setAutoUpstall] = useState("");
    const [ssl, setSsl] = useState(false);
    const [upgrade, setUpgrade] = useState(false);
    const [domain, setDomain] = useState("");
    const [container, setContainer] = useState("");
    const [containers, setContainers] = useState<Array<string>>([]);
    const [error, setError] = useState("");

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const convertedObject = convertToAutoUpstall(composeYaml, ssl, domain, container);
            setAutoUpstall(YAML.stringify(convertedObject));
        } catch (e) {
            setError(e as string);
        }
    }

    useEffect(() => {
        if (!compose) return;

        try {
            const yml = YAML.parse(compose);
            setComposeYaml(yml);

            const services = Object.keys(yml["services"]);
            setContainers(services);
        } catch (e) {
            console.error(e);
        }
    }, [compose]);

    return (
        <main className="flex h-dvh flex-col items-center justify-between pt-8">
            <h1 className="text-4xl font-bold">AutoUpstall</h1>
            <p className="text-lg text-center">Docker Compose =&gt; Docker Compose + Auto SSL + Auto Upgrades</p>
            <div
                hidden={!error}
                className="max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700"
                role="alert">
                <div className="flex p-4">
                    <div className="flex-shrink-0">
                        <svg className="flex-shrink-0 size-4 text-red-500 mt-0.5" xmlns="http://www.w3.org/2000/svg"
                             width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path
                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
                        </svg>
                    </div>
                    <div className="ms-3">
                        <p className="text-sm text-gray-700 dark:text-neutral-400">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex w-full h-full items-center justify-between mt-4">
                <form className="w-1/2 h-full p-2 px-12 border-r-2" onSubmit={handleSubmit}>
                    <h2 className="text-xl font-bold">Your Docker Compose</h2>
                    <Editor className="w-full mt-2"
                            height="66%"
                            value={compose}
                            onChange={(value) => setCompose(value || "")}
                            defaultLanguage="yaml"
                    />
                    <div className="mt-2">
                        <input type="checkbox" value="Auto SSL"
                               id="ssl"
                               checked={ssl}
                               onChange={(e) => setSsl(e.target.checked)}/>
                        <label htmlFor="ssl" className="ml-2">Auto SSL</label>

                        <div className="mt-1 ml-5" hidden={!ssl}>
                            <label htmlFor={"domain"}>Domain</label>
                            <input type="text" placeholder="something.yourdomain.com"
                                   id="domain"
                                   required={ssl}
                                   className="ml-2"
                                   value={domain}
                                   onChange={(e) => setDomain(e.target.value)}/>
                        </div>
                    </div>

                    <div className="mt-2">
                        <input type="checkbox" value="Auto Upgrade"
                               id="upgrade"
                               checked={upgrade}
                               onChange={(e) => setUpgrade(e.target.checked)}/>
                        <label htmlFor="upgrade" className="ml-2">Auto Upgrade</label>

                        <div className="mt-1 ml-5" hidden={!upgrade}>
                            <label htmlFor="container">Container</label>
                            <select id="container" required={upgrade} onChange={(e) => setContainer(e.target.value)}>
                                {containers.map((container, index) => (
                                    <option key={index} value={container}>{container}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-center mt-4 w-full">
                        <button className="w-32 bg-blue-500 text-white py-1 rounded">
                            Convert
                        </button>
                    </div>
                </form>
                <div className="w-1/2 h-full p-2 px-12">
                    <h2 className="text-xl font-bold">AutoUpstall Docker Compose</h2>
                    <Editor className="w-full mt-2"
                            defaultLanguage="yaml"
                            height="80%"
                            value={autoUpstall}
                            options={{
                                readOnly: true
                            }}
                    />
                    <div className="flex justify-center mt-4 w-full">
                        <button className="w-32 mt-2 bg-blue-500 text-white py-1 rounded"
                                onClick={() => navigator.clipboard.writeText(autoUpstall)}>
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
