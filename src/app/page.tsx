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
    const [exposePort, setExposePort] = useState<number>();
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
            query.append("compose", JSON.stringify(convertedObject));

            router.push(`/converted?${query.toString()}`);
        } catch (e) {
            toast.error((e as {message: string}).message, {
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
                    <div className="mt-4">
                        <label htmlFor="expose" className="dark:text-gray-300">Expose Port</label>
                        <input type="number"
                               id="expose"
                               required
                               value={exposePort}
                               onChange={(e) => setExposePort(parseInt(e.target.value))}
                               className="ml-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"/>
                    </div>
                    <div className="mt-4">
                        <input type="checkbox" value="Auto SSL"
                               id="ssl"
                               checked={ssl}
                               onChange={(e) => setSsl(e.target.checked)}
                               className="dark:border-gray-600"/>
                        <label htmlFor="ssl" className="ml-2 dark:text-gray-300">Auto SSL</label>

                        <div className="mt-1 ml-5" hidden={!ssl}>
                            <label htmlFor={"domain"} className="dark:text-gray-300">Domain</label>
                            <input type="text" placeholder="something.yourdomain.com"
                                   id="domain"
                                   required={ssl}
                                   className="ml-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                   value={domain}
                                   onChange={(e) => setDomain(e.target.value)}/>
                        </div>
                    </div>
                    <div className="flex justify-center mt-4 w-full">
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
