from flask import Flask, request, jsonify
from konlpy.tag import Okt

app = Flask(__name__)
okt = Okt()

@app.route('/extract_nouns', methods=['POST'])
def extract_nouns():
    data = request.json
    text = data.get('text', '')
    nouns = okt.nouns(text)
    return jsonify({'nouns': nouns})

if __name__ == '__main__':
    app.run(debug=True)
