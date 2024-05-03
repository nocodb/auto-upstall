import {NGINX_SECURE} from "@/app/utils/constants";

interface AutoUpstallConfig {
    domain?: string;
    container: string;
    ssl: boolean;
    upgrades: Array<string>;
    port: number;
}

function verifyConfig(compose: Record<string, any>, config: AutoUpstallConfig) {
    if (config.ssl && !config.domain)
        throw "Please provide a domain when enabling SSL";

    if (config.port < 1 || config.port > 65535)
        throw "Port must be between 1 and 65535";

    if (!config.container)
        throw "Please select a container";

    if (compose.services[config.container].image.contains("nginx"))
        throw "Application container must not be Nginx";
}

function createNginxService(config: AutoUpstallConfig) {
    return {
        image: NGINX_SECURE,
        ports: ["80:80", "443:443"],
        environment: {
            PROXY_DOMAIN: config.domain || "localhost",
            SSL_ENABLED: config.ssl,
            PROXY_PORT: config.port,
            PROXY_HOST: config.container
        }
    };
}

function createWatchtowerService() {
    return {
        image: "containrrr/watchtower",
        command: "--schedule \"0 2 * * 6\" --cleanup",
        volumes: ["/var/run/docker.sock:/var/run/docker.sock"],
        restart: "unless-stopped"
    };

}

export function convertToAutoUpstall(composeYaml: Record<string, any>, config: AutoUpstallConfig) {
    verifyConfig(composeYaml, config);

    // Remove nginx, watchtower and certbot services if they exist by checking the image name
    const toDelete = Object.keys(composeYaml.services).filter((service) =>
        composeYaml.services[service].image.contains("nginx") ||
        composeYaml.services[service].image.contains("certbot") ||
        composeYaml.services[service].image.contains("watchtower")
    );

    toDelete.forEach((service) => delete composeYaml.services[service]);

    if (config.upgrades) {
        config.upgrades.forEach((upgrade) =>
            composeYaml.services[upgrade].labels = ["com.centurylinklabs.watchtower.enable=true"]);
        composeYaml.services["watchtower"] = createWatchtowerService();
    }
    composeYaml.services["nginx"] = createNginxService(config);

    return composeYaml;
}
