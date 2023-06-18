import { expect } from "@playwright/test"

export class PaymentPage {
    constructor(page) {
        this.page = page
        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]')
                                .locator('[data-qa="discount-code"]')
        this.discountInput = page.getByPlaceholder('Discount code')
        this.activateDiscountButton = page.locator('[data-qa="submit-discount-button"]')
        this.totalValue = page.locator('[data-qa="total-value"]')
        this.discountedValue = page.locator('[data-qa="total-with-discount-value"]')
        this.discountActiveMessage = page.getByText('Discount activated!')

        this.creditCardNameInput = page.locator('[data-qa="credit-card-owner"]')
        this.creditCardNumberInput = page.locator('[data-qa="credit-card-number"]')
        this.expirationDateInput = page.locator('[data-qa="valid-until"]')
        this.securityCodeInput = page.locator('[data-qa="credit-card-cvc"]')
        this.payButton = page.locator('[data-qa="pay-button"]')
    }

    activateDiscount = async() => {
        await this.discountCode.waitFor()
        const code = await this.discountCode.innerText()
        await this.discountInput.waitFor()
        await this.discountInput.fill(code)
        await expect(this.discountInput).toHaveValue(code)

        await this.activateDiscountButton.waitFor()
        await this.activateDiscountButton.click()

        await this.discountActiveMessage.waitFor()
        await expect(this.discountActiveMessage).toHaveText("Discount activated!")

        await this.discountedValue.waitFor()
        const discountValueText = await this.discountedValue.innerText()
        const discountValueOnlyStringNumber = discountValueText.replace("$", "")
        const discountValueOnlyNumber = parseInt(discountValueOnlyStringNumber)

        await this.totalValue.waitFor()
        const totalValueText = await this.totalValue.innerText()
        const totalValueOnlyStringNumber = totalValueText.replace("$", "")
        const totalValueOnlyNumber = parseInt(totalValueOnlyStringNumber)

        expect(discountValueOnlyNumber).toBeLessThan(totalValueOnlyNumber)
    }

    fillPaymentDetails = async(paymentDetails) => {
        await this.creditCardNameInput.waitFor()
        await this.creditCardNameInput.fill(paymentDetails.creditCardOwner)

        await this.creditCardNumberInput.waitFor()
        await this.creditCardNumberInput.fill(paymentDetails.creditCardNumber)

        await this.expirationDateInput.waitFor()
        await this.expirationDateInput.fill(paymentDetails.expirationDate)

        await this.securityCodeInput.waitFor()
        await this.securityCodeInput.fill(paymentDetails.securityCode)

        

      
    }

    completePayment = async() => {
        await this.payButton.waitFor()
        await this.payButton.click()
        await this.page.waitForURL(/\/thank-you/, { timeout : 3000 })
    }


}