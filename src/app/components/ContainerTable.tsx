interface ContainerTableProps {
    containers: string[];
    setContainer: (container: string) => void;
    setUpgrades: (upgrades: string[]) => void;
    upgrades: string[];
    container: string;
}

export default function ContainerTable({containers,container,  setContainer, setUpgrades, upgrades}: ContainerTableProps) {
    return (
        <div className="relative overflow-x-auto mt-2 h-2/3">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Container
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Expose
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Auto Upgrade
                    </th>
                </tr>
                </thead>
                <tbody>
                {containers.map((ctn, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {ctn}
                        </td>
                        <td className="px-6 py-4">
                            <input type="radio"
                                   value={ctn}
                                   name="container"
                                   onChange={(e) => setContainer(e.target.value)}
                                   required
                            />
                        </td>
                        <td className="px-6 py-4">
                            <input type="checkbox"
                                   value={ctn}
                                   onChange={(e) => {
                                       if (e.target.checked) {
                                           setUpgrades([...upgrades, container]);
                                       } else {
                                           setUpgrades(upgrades.filter((upgrade) => upgrade !== container));
                                       }
                                   }}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
