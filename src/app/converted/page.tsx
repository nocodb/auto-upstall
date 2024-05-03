"use client";

import {useSearchParams} from "next/navigation";

import Editor from "@monaco-editor/react";
import YAML from "yaml";
import Link from "next/link";

export default function Converted() {
    const searchParams = useSearchParams();

    const compose = JSON.parse(searchParams.get("compose") || "{}");
    const autoUpstall = YAML.stringify(compose);

    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    return (
        <main className="flex h-screen flex-col items-center justify-between pt-8 dark:bg-gray-800">
            <h2 className="text-xl font-bold dark:text-white">AutoUpstall Docker Compose</h2>
            <Editor className="w-full mt-2"
                    defaultLanguage="yaml"
                    height="80%"
                    value={autoUpstall}
                    options={{
                        readOnly: true
                    }}
                    theme={darkMode ? 'vs-dark' : 'vs-light'}
            />
            <div className="flex justify-center my-4 w-full gap-2">
                <Link href="../"
                      className="w-32 mt-2 bg-orange-700 text-white py-1 rounded text-center hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700">
                    Back
                </Link>

                <button
                    className="w-32 mt-2 bg-blue-500 text-white py-1 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    onClick={() => navigator.clipboard.writeText(autoUpstall)}>
                    Copy
                </button>
            </div>
        </main>

    );
}
