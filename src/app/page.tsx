"use client";

import {FormEvent, useEffect, useState} from "react";

import Editor from "@monaco-editor/react";
import YAML from 'yaml';
import {convertToAutoUpstall} from "@/app/utils/converter";
import {useRouter} from "next/navigation";
import ContainerTable from "@/app/components/ContainerTable";
import Header from "@/app/components/Header";
import {toast} from "react-toastify";

export default function Home() {
    const [compose, setCompose] = useState("");
    const [composeYaml, setComposeYaml] = useState({} as Record<string, any>);
    const [ssl, setSsl] = useState(false);
    const [upgrades, setUpgrades] = useState<Array<string>>([]);
    const [domain, setDomain] = useState("");
    const [container, setContainer] = useState("");
    const [exposePort, setExposePort] = useState(0);
    const [containers, setContainers] = useState<Array<string>>([]);

    const router = useRouter();

    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const convertedObject = convertToAutoUpstall(composeYaml, {
                container,
                ssl,
                upgrades,
                domain,
                port: exposePort || 80
            });

            // Send the converted object to the next page as a query parameter
            const query = new URLSearchParams();
            query.append("compose", YAML.stringify(convertedObject));

            router.push(`/converted?${query.toString()}`);
        } catch (e) {
            toast.error((e as { message: string }).message || String(e), {
                theme: darkMode ? "dark" : "light"
            });
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
            toast.error("Invalid Docker Compose file", {
                theme: darkMode ? "dark" : "light"
            });
        }
    }, [compose, darkMode]);

    return (
        <main className="flex h-dvh flex-col items-center justify-between pt-8 dark:bg-gray-800 dark:text-white">
            <Header/>
            <div className="flex w-full h-full items-center justify-between mt-4">
                <div className="w-1/2 h-full p-2 px-12 border-r-2 dark:border-gray-600">
                    <h2 className="text-xl font-bold">Your Docker Compose</h2>
                    <Editor className="w-full mt-2"
                            height="95%"
                            value={compose}
                            onChange={(value) => setCompose(value || "")}
                            defaultLanguage="yaml"
                            theme={darkMode ? 'vs-dark' : 'vs-light'} // Assuming you manage a 'darkMode' state
                    />
                </div>
                <form className="w-1/2 h-full p-2 px-12" onSubmit={handleSubmit}>
                    <h2 className="text-xl font-bold">Container Configurations</h2>
                    <ContainerTable
                        containers={containers}
                        setContainer={setContainer}
                        container={container}
                        setUpgrades={setUpgrades}
                        upgrades={upgrades}
                    />
                    <div className="mt-4 flex w-full items-center gap-16">
                        <div className="relative h-10 w-1/4">
                            <input
                                className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 dark:border-white dark:!text-white dark:focus:border-white"
                                placeholder=" "
                                id="expose"
                                required
                                value={exposePort}
                                onChange={(e) => setExposePort(parseInt(e.target.value) || 0)}
                            />
                            <label
                                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 dark:!text-white dark:before:border-white dark:after:border-white dark:peer-focus:text-white dark:peer-focus:before:!border-white dark:peer-focus:after:!border-white"
                            >
                                Exposed Port
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" value="Auto SSL"
                                   id="ssl"
                                   checked={ssl}
                                   onChange={(e) => setSsl(e.target.checked)}
                                   className="dark:border-gray-600"
                            />
                            <label htmlFor="ssl" className="ml-2 dark:text-gray-300">Auto SSL</label>

                            <div className="ml-5 relative h-10" hidden={!ssl}>

                                <input type="text" placeholder=" "
                                       id="domain"
                                       required={ssl}
                                       className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 dark:border-white dark:!text-white dark:focus:border-white"
                                       value={domain}
                                       onChange={(e) => setDomain(e.target.value)}/>
                                <label htmlFor={"domain"}
                                       className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 dark:!text-white dark:before:border-white dark:after:border-white dark:peer-focus:text-white dark:peer-focus:before:!border-white dark:peer-focus:after:!border-white"
                                >
                                    Domain
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-6 w-full">
                        <button
                            className="w-32 bg-blue-500 text-white py-1 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                            Convert
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
