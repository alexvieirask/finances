''' Importação das configurações e serviços '''
from services.config import *

@app.route('/js/<path:filename>')
def serve_js(filename):
    try:
        parent_dir = os.path.dirname(app.root_path)
        js_dir = os.path.join(parent_dir, 'src', 'static', 'js')
        filepath = os.path.join(js_dir, filename)

        if not os.path.isfile(filepath):
            return "Arquivo não encontrado", 404
    
        cache_timeout = 604800  
        response = make_response(send_from_directory(js_dir, filename))
        response.headers['Cache-Control'] = f"public, max-age={cache_timeout}"

        return response

    except Exception as error:
        response = jsonify({"status": 777, "details": str(error)})
        return response

@app.route('/json/<path:filename>')
def serve_json(filename):
    try:
        parent_dir = os.path.dirname(app.root_path)
        js_dir = os.path.join(parent_dir, 'src', 'static', 'json')
        filepath = os.path.join(js_dir, filename)

        if not os.path.isfile(filepath):
            return "Arquivo não encontrado", 404
    
        cache_timeout = 604800  
        response = make_response(send_from_directory(js_dir, filename))
        response.headers['Cache-Control'] = f"public, max-age={cache_timeout}"

        return response

    except Exception as error:
        response = jsonify({"status": 777, "details": str(error)})
        return response


@app.route('/css/<path:filename>')
def serve_css(filename):
    try:
        parent_dir = os.path.dirname(app.root_path)
        css_dir = os.path.join(parent_dir, 'src', 'static', 'css')
        filepath = os.path.join(css_dir, filename)

        if not os.path.isfile(filepath):
            return "Arquivo não encontrado", 404
    
        cache_timeout = 604800  
        response = make_response(send_from_directory(css_dir, filename))
        response.headers['Cache-Control'] = f"public, max-age={cache_timeout}"
        return response

    except Exception as error:
        response = jsonify({"status": 777, "details": str(error)})
        return response