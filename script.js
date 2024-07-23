<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shuffle Numbers & Modify Phone Numbers</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(to bottom right, #e0ffff, #cce0ff);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            min-height: 100vh;
        }

        .container {
            background-color: #ffffff;
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            padding: 40px;
            text-align: center;
            animation: fadeIn 1s ease-in-out;
            margin-bottom: 20px;
            width: 80%;
            max-width: 500px;
        }

        h1 {
            font-size: 32px;
            color: #336699;
            margin-bottom: 30px;
        }

        .input-section, .file-section {
            margin-bottom: 40px;
        }

        label {
            display: block;
            font-size: 18px;
            color: #555;
            margin-bottom: 10px;
        }

        input[type="text"], input[type="file"] {
            width: 100%;
            padding: 15px;
            font-size: 18px;
            border: 2px solid #cce0ff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
            transition: border-color 0.3s ease;
        }

        input[type="text"]:focus, input[type="file"]:focus {
            outline: none;
            border-color: #66b3ff;
        }

        .shuffle-btn, .process-btn {
            background-color: #3399ff;
            color: white;
            padding: 15px 30px;
            font-size: 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .shuffle-btn:hover, .process-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        #downloadLink {
            display: none;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Enter Number and Check Your Luck</h1>
        <div class="input-section">
            <label for="inputNumber">Enter 10-digit Numbers (separated by commas):</label>
            <input type="text" id="inputNumber" placeholder="Enter numbers separated by commas">
        </div>
        <button class="shuffle-btn" onclick="shuffleAndDownload()">Shuffle and Download</button>
    </div>

    <div class="container">
        <h1>Phone Number Modifier</h1>
        <div class="file-section">
            <label for="fileInput">Upload Excel File:</label>
            <input type="file" id="fileInput">
        </div>
        <button class="process-btn" onclick="processFile()">Process File</button>
        <a id="downloadLink">Download Modified File</a>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js"></script>
    <script src="script.js"></script>
    <script>
        function processFile() {
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];

            if (!file) {
                alert('Please select a file.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                // Combine all data into a single column, avoiding blank cells, and ignoring the first row
                let combinedData = [];
                json.slice(1).forEach(row => {
                    row.forEach(cell => {
                        if (cell !== null && cell !== undefined && cell !== "") {
                            combinedData.push(cell);
                        }
                    });
                });

                // Process the combined data
                const processedData = combinedData.map(cell => {
                    if (typeof cell === 'string' && cell.startsWith('0')) {
                        return '971' + cell.slice(1);
                    }
                    return cell;
                });

                // Convert processed data to a 2D array for the worksheet with a header
                const finalData = [["MSISDN"]];
                processedData.forEach(item => finalData.push([item]));

                // Create a new worksheet
                const newSheet = XLSX.utils.aoa_to_sheet(finalData);
                const newWorkbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Modified');

                // Create a Blob from the workbook
                const wbout = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([wbout], { type: 'application/octet-stream' });

                // Create a link to download the Blob
                const url = URL.createObjectURL(blob);
                const downloadLink = document.getElementById('downloadLink');
                downloadLink.href = url;
                downloadLink.download = 'modified_phone_numbers.xlsx';
                downloadLink.style.display = 'block';
            };
            reader.readAsArrayBuffer(file);
        }
    </script>
</body>
</html>
