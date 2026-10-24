import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.concurrent.Executors;

public class TodoServer {
    private static final int PORT = 5052;
    private static final Path PUBLIC_DIRECTORY = findSiteRoot();
    private static final Map<String, String> CONTENT_TYPES = Map.of(
        "html", "text/html; charset=utf-8",
        "css", "text/css; charset=utf-8",
        "js", "text/javascript; charset=utf-8",
        "svg", "image/svg+xml",
        "jpg", "image/jpeg",
        "jpeg", "image/jpeg",
        "png", "image/png",
        "webp", "image/webp",
        "ico", "image/x-icon"
    );

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress("localhost", PORT), 0);
        server.createContext("/api/status", TodoServer::sendStatus);
        server.createContext("/", TodoServer::serveStaticFile);
        server.setExecutor(Executors.newFixedThreadPool(4));
        server.start();

        System.out.println("FocusList is running at http://localhost:" + PORT);
    }

    private static Path findSiteRoot() {
        Path current = Path.of("").toAbsolutePath().normalize();
        if (Files.isRegularFile(current.resolve("index.html"))) return current;
        Path parent = current.getParent();
        if (parent != null && Files.isRegularFile(parent.resolve("index.html"))) return parent;
        throw new IllegalStateException("Run the server from the project folder or its server folder.");
    }

    private static void sendStatus(HttpExchange exchange) throws IOException {
        byte[] response = "{\"status\":\"online\",\"server\":\"Java HttpServer\"}"
            .getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(200, response.length);
        exchange.getResponseBody().write(response);
        exchange.close();
    }

    private static void serveStaticFile(HttpExchange exchange) throws IOException {
        String requestPath = exchange.getRequestURI().getPath();
        if (requestPath.equals("/")) requestPath = "/index.html";

        Path file = PUBLIC_DIRECTORY.resolve(requestPath.substring(1)).normalize();
        if (!file.startsWith(PUBLIC_DIRECTORY) || !Files.isRegularFile(file)) {
            sendText(exchange, 404, "Page not found");
            return;
        }

        byte[] response = Files.readAllBytes(file);
        exchange.getResponseHeaders().set("Content-Type", contentType(file));
        exchange.sendResponseHeaders(200, response.length);
        exchange.getResponseBody().write(response);
        exchange.close();
    }

    private static String contentType(Path file) {
        String name = file.getFileName().toString();
        int dot = name.lastIndexOf('.');
        String extension = dot >= 0 ? name.substring(dot + 1) : "";
        return CONTENT_TYPES.getOrDefault(extension, "application/octet-stream");
    }

    private static void sendText(HttpExchange exchange, int status, String message) throws IOException {
        byte[] response = message.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=utf-8");
        exchange.sendResponseHeaders(status, response.length);
        exchange.getResponseBody().write(response);
        exchange.close();
    }
}
