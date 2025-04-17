<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    /** @use HasFactory<\Database\Factories\SettingFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'key',
        'value',
        'display_name',
        'type',
        'options',
        'group',
        'description',
        'is_public',
        'order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_public' => 'boolean',
        'order' => 'integer',
        'options' => 'array',
    ];

    /**
     * Get the formatted value based on the setting type.
     *
     * @return mixed
     */
    public function getFormattedValueAttribute()
    {
        switch ($this->type) {
            case 'boolean':
                return (bool) $this->value;
            case 'number':
                return (float) $this->value;
            case 'array':
            case 'json':
                return json_decode($this->value, true);
            default:
                return $this->value;
        }
    }
}
