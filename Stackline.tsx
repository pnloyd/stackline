import React, { useState, useEffect } from 'react'
import getStacklineData from './getStacklineData'
import { LineChart, XAxis, Line, YAxis } from 'recharts'
import moment from 'moment'

export default () => {
  const [productData, setProductData] = useState([])
  const [viewingProduct, setViewingProduct] = useState(null)

  useEffect(() => {
    getStacklineData().then((response) => {
      setProductData(response)
      if (!viewingProduct && response.length > 0) {
        setViewingProduct(response[0])
      }
    })
  }, [])

  return (
    <div>
      {viewingProduct ?
        <StackLineProductView product={viewingProduct} /> : "Loading..."
      }
    </div>
  )
}

function StackLineProductView({ product }: any) {
  const { 
    image, 
    title, 
    subtitle, 
    tags,
    sales
  } = product

  const menuItemStyle = {
    fontSize: '20px',
    color: '#9ba6b9',
    marginBottom: '45px'
  }

  const tableHeaderStyle = {
    paddingBottom: '35px',
    fontSize: '15px',
    color: '#56546c'
  }

  const tableCellStyle = {
    color: '#aabcd0',
    paddingBottom: '35px',
    fontSize: '14px'
  }

  const formatWeekEndingForTable = (weekEnding: string) => {
    return moment(weekEnding, 'YYYY-MM-DD').format('MM-DD-YY')
  }

  // from stackoverflow
  function formatCurrency(x: number) {
    return '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const graphDataFromSales = (sales: any) => {
    const salesByMonth = sales.reduce((acc: any, sale: any) => {
      const saleMonth = moment(sale.weekEnding, 'YYYY-MM-DD')
        .format('MMM').toUpperCase()

      acc[saleMonth] = acc[saleMonth] || {
        month: saleMonth,
        retailSales: 0,
        retailerMargin: 0,
        wholesaleSales: 0
      }

      acc[saleMonth].retailSales += sale.retailSales
      acc[saleMonth].retailerMargin += sale.retailerMargin
      acc[saleMonth].wholesaleSales += sale.wholesaleSales
      return acc
    }, {})

    return Object.values(salesByMonth)
  }

  return (
    <div
      style={{
        padding: '50px',
        display: 'flex',
        flexFlow: 'row nowrap'
      }}
    >
      <div
        style={{
          flex: '0 0 320px'
        }}
      >
        <img 
          src={image} 
          style={{
            width: '165px',
            margin: '0 auto',
            display: 'block'
          }}
        />
        <h3
          style={{
            textAlign: 'center',
            fontSize: '18px',
            color: '#334255'
          }}
        >
          {title}
        </h3>
        <div
          style={{
            color: '#b2c2d9',
            fontSize: '20px',
            textAlign: 'center',
            marginBottom: '20px'
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            display: 'flex',
            flexFlow: 'row wrap',
            marginBottom: '50px'
          }}
        >
          {tags.map((tag: string) =>
            <div
              style={{
                fontSize: '13px',
                color: '#56546c',
                padding: '0 22px',
                margin: '3px',
                lineHeight: '2',
                border: '2px solid #eaecf3',
                borderRadius: '5px'
              }}
            >
              {tag}
            </div>
          )}
        </div>
        <div style={menuItemStyle}>
          OVERVIEW
        </div>
        <div style={Object.assign({}, menuItemStyle, { color: '#334255'})}>
          SALES
        </div>
      </div>
      <div
        style={{
          flex: '1 1 auto'
        }}
      >
        <h2
          style={{
            color: '#313f51',
            fontSize: '17px'
          }}
        >
          Retail Sales
        </h2>
        <LineChart
          width={1500}
          height={600}
          data={graphDataFromSales(sales) as any}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="month" axisLine={false}  />
          <YAxis domain={[0, dataMax => (dataMax * 1.2)]} hide={true} />
          <Line type="monotone" dataKey="retailSales" stroke="#40a5f6" strokeWidth="4" />
          <Line type="monotone" dataKey="wholesaleSales" stroke="#9aa5bf" strokeWidth="4" />
        </LineChart>
        <table
          style={{
            width: '100%'
          }}
        >
          <thead
            style={{
              textAlign: 'left',
              marginBottom: '20px'
            }}
          >
            <th style={tableHeaderStyle}>WEEK ENDING</th>
            <th style={tableHeaderStyle}>RETAIL SALES</th>
            <th style={tableHeaderStyle}>WHOLESALE SALES</th>
            <th style={tableHeaderStyle}>UNITS SOLD</th>
            <th style={tableHeaderStyle}>RETAILER MARGIN</th>
          </thead>
          <tbody>
            {sales.map(({ weekEnding, retailSales, wholesaleSales, unitsSold, retailerMargin }: any) => (
              <tr>
                <td style={tableCellStyle}>{formatWeekEndingForTable(weekEnding)}</td>
                <td style={tableCellStyle}>{formatCurrency(retailSales)}</td>
                <td style={tableCellStyle}>{formatCurrency(wholesaleSales)}</td>
                <td style={tableCellStyle}>{unitsSold}</td>
                <td style={tableCellStyle}>{formatCurrency(retailerMargin)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}