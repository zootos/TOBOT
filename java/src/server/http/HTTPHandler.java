package server.http;

import java.util.HashMap;
import java.util.function.Function;
import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;
import org.apache.http.ProtocolVersion;
import org.apache.http.impl.DefaultHttpResponseFactory;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.HttpCoreContext;
import server.http.handlers.APIHttpHandler;
import server.http.handlers.IndexPageHTTPHandler;
import server.http.handlers.StaticContentHttpHandler;

public class HTTPHandler {

  private static HashMap<String, Function<HttpRequest, HttpResponse>> handlerRegistry = populateRegistry();

  public static HttpResponse handleRequest(HttpRequest httpRequest) {
    String uri = httpRequest.getRequestLine().getUri();
    for (String uriRegex : handlerRegistry.keySet()) {
      if (uri.matches(uriRegex)) {
        return handlerRegistry.get(uriRegex).apply(httpRequest);
      }
    }

    // Permanent redirect to the index.html page if the uri does not match any handler in the registry
    HttpResponse response = new DefaultHttpResponseFactory()
        .newHttpResponse(new ProtocolVersion("HTTP", 1, 1), 301, new HttpCoreContext());
    response.addHeader(new BasicHeader("Location", "/index.html"));
    return response;

  }

  private static HashMap<String, Function<HttpRequest, HttpResponse>> populateRegistry(){
    HashMap<String, Function<HttpRequest, HttpResponse>> handlerRegistry = new HashMap<>();

    // Register method calls for handler
    handlerRegistry.put("\\/index.html", IndexPageHTTPHandler::handleRequest);
    handlerRegistry.put("\\/static\\/.*", StaticContentHttpHandler::handleRequest);
    handlerRegistry.put("\\/api\\/.*", APIHttpHandler::handleRequest);

    return handlerRegistry;
  }

}
