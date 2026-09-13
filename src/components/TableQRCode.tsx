import { QRCodeSVG } from 'qrcode.react'

type TableQRCodeProps = {
    tableNumber: number
}

const SITE_URL =
    import.meta.env.VITE_SITE_URL ||
    window.location.origin

function TableQRCode({ tableNumber }: TableQRCodeProps) {
    const tableUrl = `${SITE_URL}/table/${tableNumber}`

    return (
        <div>
            <h2>Table {tableNumber}</h2>

            <QRCodeSVG
                value={tableUrl}
                size={220}
                level="H"
                includeMargin
            />

            <p>{tableUrl}</p>
        </div>
    )
}

export default TableQRCode