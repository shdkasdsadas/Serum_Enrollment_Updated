import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

export async function populateWordTemplate(data) {
    try {
        const response = await fetch('/EF_Template.docx');
        const arrayBuffer = await response.arrayBuffer();

        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        doc.setData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            department: data.department || '',
            position: data.position || '',
            startDate: data.startDate || '',
            employeeId: data.employeeId || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zipCode || '',
            emergencyContactName: data.emergencyContactName || '',
            emergencyContactPhone: data.emergencyContactPhone || '',
        });

        doc.render();

        const blob = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        return blob;
    } catch (error) {
        console.error('Error processing Word template:', error);
        throw new Error('Failed to generate Word document');
    }
}

export async function generatePDF(data) {
    try {
        const html2pdf = (await import('html2pdf.js')).default;

        const content = `
            <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #667eea; text-align: center; margin-bottom: 30px;">Employee Enrollment Form</h1>

                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #333; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Personal Information</h2>
                    <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Phone:</strong> ${data.phone}</p>
                    ${data.address ? `<p><strong>Address:</strong> ${data.address}</p>` : ''}
                    ${data.city ? `<p><strong>City:</strong> ${data.city}</p>` : ''}
                    ${data.state ? `<p><strong>State:</strong> ${data.state}</p>` : ''}
                    ${data.zipCode ? `<p><strong>Zip Code:</strong> ${data.zipCode}</p>` : ''}
                </div>

                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #333; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Employment Details</h2>
                    <p><strong>Department:</strong> ${data.department}</p>
                    <p><strong>Position:</strong> ${data.position}</p>
                    <p><strong>Start Date:</strong> ${new Date(data.startDate).toLocaleDateString()}</p>
                    ${data.employeeId ? `<p><strong>Employee ID:</strong> ${data.employeeId}</p>` : ''}
                </div>

                ${data.emergencyContactName || data.emergencyContactPhone ? `
                    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="color: #333; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Emergency Contact</h2>
                        ${data.emergencyContactName ? `<p><strong>Name:</strong> ${data.emergencyContactName}</p>` : ''}
                        ${data.emergencyContactPhone ? `<p><strong>Phone:</strong> ${data.emergencyContactPhone}</p>` : ''}
                    </div>
                ` : ''}

                ${data.photoData ? `
                    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                        <h2 style="color: #333; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Employee Photo</h2>
                        <img src="${data.photoData}" style="max-width: 300px; max-height: 300px; border-radius: 8px;" alt="Employee photo">
                    </div>
                ` : ''}

                <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <p style="color: #666; font-size: 12px;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                </div>
            </div>
        `;

        const element = document.createElement('div');
        element.innerHTML = content;

        const opt = {
            margin: 10,
            filename: `employee_${data.firstName}_${data.lastName}_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        return html2pdf().set(opt).from(element).save();
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    }
}