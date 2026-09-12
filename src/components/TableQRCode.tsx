import { QRCodeCanvas } from 'qrcode.react'

type TableQRCodeProps = {
    tableNumber: number
}

function TableQRCode({ tableNumber }: TableQRCodeProps) {
    const tableUrl = `http://192.168.1.7:5173/table/${tableNumber}`

    return (
        <div className="card qr-card">
            <h3>🪑 Table {tableNumber}</h3>

            <QRCodeCanvas
                value={tableUrl}
                size={200}
                bgColor="#0f1528"
                fgColor="#e8eaf0"
            />

            <p>{tableUrl}</p>
        </div>
    )
}

export default TableQRCode