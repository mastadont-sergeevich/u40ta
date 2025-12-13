"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailFileAnalyzer = void 0;
const common_1 = require("@nestjs/common");
const XLSX = __importStar(require("xlsx"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
let EmailFileAnalyzer = class EmailFileAnalyzer {
    async analyzeExcel(filePath) {
        console.log(`🔍 Анализируем Excel файл: ${filePath}`);
        const ext = path.extname(filePath).toLowerCase();
        if (ext !== '.xlsx' && ext !== '.xls') {
            return {
                isValid: false,
                error: 'Это не Excel-таблица. Поддерживаются только .xlsx и .xls файлы'
            };
        }
        if (!fs.existsSync(filePath)) {
            return {
                isValid: false,
                error: 'Файл не найден на диске'
            };
        }
        try {
            const workbook = XLSX.readFile(filePath);
            const firstSheetName = workbook.SheetNames[0];
            if (!firstSheetName) {
                return {
                    isValid: false,
                    error: 'Файл не содержит листов'
                };
            }
            const worksheet = workbook.Sheets[firstSheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            if (data.length === 0) {
                return {
                    isValid: false,
                    error: 'Файл пустой (нет данных)'
                };
            }
            const firstRow = data[0];
            const requiredColumns = [
                'Завод',
                'Склад',
                'КрТекстМатериала',
                'Материал',
                'Партия',
                'Запас на конец периода'
            ];
            const missingColumns = [];
            for (const column of requiredColumns) {
                if (!(column in firstRow)) {
                    missingColumns.push(column);
                }
            }
            if (missingColumns.length > 0) {
                return {
                    isValid: false,
                    error: `Некорректная структура данных. Отсутствуют колонки: ${missingColumns.join(', ')}`
                };
            }
            let sklad = '';
            for (const row of data) {
                const rowSklad = row['Склад'];
                if (rowSklad && typeof rowSklad === 'string' && rowSklad.trim() !== '') {
                    sklad = rowSklad.trim();
                    break;
                }
            }
            if (!sklad) {
                return {
                    isValid: false,
                    error: 'Не удалось определить склад (колонка "Склад" пустая во всех строках)'
                };
            }
            return {
                isValid: true,
                docType: 'ОСВ',
                sklad: sklad
            };
        }
        catch (error) {
            console.error('❌ Ошибка анализа Excel файла:', error);
            let errorMessage = 'Ошибка чтения файла';
            if (error.message.includes('not a valid zip file')) {
                errorMessage = 'Файл поврежден или не является Excel-файлом';
            }
            else if (error.message.includes('file not found')) {
                errorMessage = 'Файл не найден';
            }
            return {
                isValid: false,
                error: `${errorMessage}: ${error.message}`
            };
        }
    }
};
exports.EmailFileAnalyzer = EmailFileAnalyzer;
exports.EmailFileAnalyzer = EmailFileAnalyzer = __decorate([
    (0, common_1.Injectable)()
], EmailFileAnalyzer);
//# sourceMappingURL=email-file-analyzer.service.js.map