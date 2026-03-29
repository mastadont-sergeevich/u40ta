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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailFileAnalyzer = void 0;
const common_1 = require("@nestjs/common");
const XLSX = __importStar(require("xlsx"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const logs_service_1 = require("../../logs/logs.service");
let EmailFileAnalyzer = class EmailFileAnalyzer {
    logsService;
    osvColumns = [
        'Завод',
        'Склад',
        'КрТекстМатериала',
        'Материал',
        'Партия',
        'Запас на конец периода'
    ];
    osColumns = [
        'Основное средство',
        'Название',
        'Инвентарный номер',
        'МОЛ'
    ];
    constructor(logsService) {
        this.logsService = logsService;
    }
    async analyzeExcel(filePath) {
        console.log(`Анализируем Excel файл: ${filePath}`);
        this.logsService.log('backend', null, {
            action: 'excel_analysis',
            filePath: filePath,
            status: 'started'
        });
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
            const hasOsvColumns = this.hasRequiredColumns(firstRow, this.osvColumns);
            if (hasOsvColumns) {
                return await this.analyzeOsvDocument(data);
            }
            const hasOsColumns = this.hasRequiredColumns(firstRow, this.osColumns);
            if (hasOsColumns) {
                return await this.analyzeOsDocument(data);
            }
            return {
                isValid: false,
                error: `Некорректная структура данных. Файл должен содержать колонки для ОСВ (${this.osvColumns.join(', ')}) или для ОС (${this.osColumns.join(', ')})`
            };
        }
        catch (error) {
            let errorMessage = 'Ошибка чтения файла';
            if (error.message.includes('not a valid zip file')) {
                errorMessage = 'Файл поврежден или не является Excel-файлом';
            }
            else if (error.message.includes('file not found')) {
                errorMessage = 'Файл не найден';
            }
            console.error(`Ошибка анализа Excel файла: ${error.message}`, error.stack);
            this.logsService.log('backend', null, {
                action: 'excel_analysis',
                result: 'error',
                filePath,
                error: errorMessage
            });
            return {
                isValid: false,
                error: `${errorMessage}: ${error.message}`
            };
        }
    }
    hasRequiredColumns(row, requiredColumns) {
        for (const column of requiredColumns) {
            if (!(column in row)) {
                return false;
            }
        }
        return true;
    }
    async analyzeOsvDocument(data) {
        let zavod = 0;
        let sklad = '';
        for (const row of data) {
            const rowZavod = row['Завод'];
            const rowSklad = row['Склад'];
            if (typeof rowZavod === 'number') {
                zavod = rowZavod;
            }
            else if (typeof rowZavod === 'string') {
                const parsed = parseInt(rowZavod.trim(), 10);
                zavod = isNaN(parsed) ? 0 : parsed;
            }
            else {
                zavod = Number(rowZavod) || 0;
            }
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
        this.logsService.log('backend', null, {
            action: 'excel_analysis',
            result: 'success',
            docType: 'ОСВ',
            zavod,
            sklad
        });
        return {
            isValid: true,
            docType: 'ОСВ',
            zavod: zavod,
            sklad: sklad
        };
    }
    async analyzeOsDocument(data) {
        let sklad = '';
        for (const row of data) {
            const rowMol = row['МОЛ'];
            if (rowMol !== undefined && rowMol !== null && rowMol !== '') {
                sklad = String(rowMol).trim();
                if (sklad !== '') {
                    break;
                }
            }
        }
        if (!sklad) {
            return {
                isValid: false,
                error: 'Не удалось определить склад (колонка "МОЛ" пустая во всех строках)'
            };
        }
        this.logsService.log('backend', null, {
            action: 'excel_analysis',
            result: 'success',
            docType: 'ОС',
            sklad
        });
        return {
            isValid: true,
            docType: 'ОС',
            zavod: 0,
            sklad: sklad
        };
    }
};
exports.EmailFileAnalyzer = EmailFileAnalyzer;
exports.EmailFileAnalyzer = EmailFileAnalyzer = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logs_service_1.LogsService])
], EmailFileAnalyzer);
//# sourceMappingURL=email-file-analyzer.service.js.map