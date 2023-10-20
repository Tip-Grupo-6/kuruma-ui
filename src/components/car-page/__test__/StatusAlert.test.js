import React from "react";

import renderer from 'react-test-renderer';
import {render, screen} from '@testing-library/react'

import {StatusAlert} from "../StatusAlert";

it('status alert should match with snapshot', () => {
    const component = renderer.create(
        <StatusAlert status={null} onClose={() => {}} open={false}/>
    )

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})

describe("open alert", () => {
    it.each([
        {open: false, className: "MuiCollapse-hidden"},
        {open: true, className: "MuiCollapse-entered"},
    ])("when open is '$open' should have class '$className'", ({open, className}) => {
        render(
            <StatusAlert status={null} onClose={() => {}} open={open}/>
        )
        const container = screen.getByTestId("collapse")
        expect(container).toHaveClass(className);
    })
});

describe("check icon status", () => {
    it.each([
        {status_color: 'red', iconId: "ErrorOutlineIcon"},
        {status_color: 'yellow', iconId: "ReportProblemOutlinedIcon"},
        {status_color: 'green', iconId: "SuccessOutlinedIcon"}
    ])("when status is '$status' should have icon '$iconId'", ({status_color , iconId}) => {
        render(
            <StatusAlert status={{status_color: status_color}} onClose={() => {}} open={false}/>
        )
        const container = screen.getByTestId(iconId)
        expect(container).toBeTruthy();
    })
});

it('check message info with status', () => {
    const name = 'Aceite'
    const last_change = '01/01/2023'
    const next_change_due = '01/12/2023'
    render(
        <StatusAlert status={{name, last_change, next_change_due}} onClose={() => {}} open={false}/>
    )
    const container = screen.getByTestId('alert')
    expect(screen.getByText(`Chequeo de ${name}`)).toBeInTheDocument();
    expect(container).toHaveTextContent(`Último chequeo: ${last_change}`)
    expect(container).toHaveTextContent(`Próximo chequeo: ${next_change_due}`)
})
