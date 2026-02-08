/**
 * Pagination Component
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui';
import { ResponseMeta } from '../../types';

interface PaginationProps {
    meta: ResponseMeta;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
    const { page, totalPages, total, limit } = meta;

    if (totalPages <= 1) return null;

    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (page <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = page - 1; i <= page + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--spacing-4) var(--spacing-6)',
                borderTop: '1px solid var(--color-border-secondary)',
                flexWrap: 'wrap',
                gap: 'var(--spacing-4)',
            }}
        >
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                Showing <span style={{ color: 'var(--color-text-secondary)' }}>{startItem}</span> to{' '}
                <span style={{ color: 'var(--color-text-secondary)' }}>{endItem}</span> of{' '}
                <span style={{ color: 'var(--color-text-secondary)' }}>{total}</span> results
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    icon={<ChevronLeft size={16} />}
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    aria-label="Previous page"
                />

                {getPageNumbers().map((pageNum, index) => (
                    <React.Fragment key={index}>
                        {pageNum === '...' ? (
                            <span style={{ padding: '0 var(--spacing-2)', color: 'var(--color-text-muted)' }}>
                                ...
                            </span>
                        ) : (
                            <Button
                                variant={pageNum === page ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => onPageChange(pageNum as number)}
                                style={{
                                    minWidth: 36,
                                    background: pageNum === page ? 'var(--gradient-primary)' : undefined,
                                }}
                            >
                                {pageNum}
                            </Button>
                        )}
                    </React.Fragment>
                ))}

                <Button
                    variant="secondary"
                    size="sm"
                    icon={<ChevronRight size={16} />}
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    aria-label="Next page"
                />
            </div>
        </div>
    );
};

export default Pagination;
